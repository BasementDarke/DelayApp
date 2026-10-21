FROM node:22 AS angular-build

WORKDIR /src/angular

COPY delay-app/package*.json ./

RUN npm ci

COPY delay-app ./

RUN npm run build


FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-build

WORKDIR /src

COPY DelayApi.slnx DelayApi/

COPY DelayApi.csproj DelayAPi/

RUN dotnet restore DelayAPi/

COPY DelayApi/ DelayApi/

RUN dotnet publish DelayAPi/DelayApi.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=dotnet-build /app/publish .

COPY --from=angular-build /src/angular/dist/delay-app/browser ./wwwroot

ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "DelayAPi.dll"]
