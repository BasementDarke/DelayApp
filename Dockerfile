FROM node:22 AS angular-build

WORKDIR /src/angular

COPY delay-app/package*.json ./

RUN npm ci

COPY delay-app ./

RUN npm run build


FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-build

WORKDIR /src

COPY DelayApi/DelayApi.csproj DelayApi/

RUN dotnet restore DelayApi/DelayApi.csproj

COPY DelayApi/ DelayApi/

RUN dotnet publish DelayApi/DelayApi.csproj \
    -c Release \
    -o /app/publish

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS final

WORKDIR /app

COPY --from=dotnet-build /app/publish .

COPY --from=angular-build /src/angular/dist/delay-app/browser ./wwwroot

RUN pwsh /app/playwright.ps1 install --with-deps chromium

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=production
ENV IS_GOOGLE_CLOUD=true

EXPOSE 8080

ENTRYPOINT ["dotnet", "DelayApi.dll"]
