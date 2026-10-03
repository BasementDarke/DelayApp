using DelayApi.Models;
using Microsoft.Playwright;
using System.Text.Json;
using System.Xml.Linq;

namespace DelayApi.Services
{


    public class JourneyService
    {
        private readonly IPlaywright _playwright;
        private readonly IBrowser _browser;

        //private readonly websiteBaseUrl = "https://www.skanetrafiken.se/"

        public JourneyService()
        {
            _playwright = Playwright.CreateAsync()
                .GetAwaiter()
                .GetResult();

            _browser = _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
                {
                    Headless = false
                })
                .GetAwaiter()
                .GetResult();
        }

        public async Task<JsonElement?> SearchAsync(string departureStation, string arrivalStation, int taskKey)
        {
            var context = await _browser.NewContextAsync();
            var page = await context.NewPageAsync();

            try
            {
                await page.GotoAsync("https://www.skanetrafiken.se/", new PageGotoOptions
                {
                    WaitUntil = WaitUntilState.NetworkIdle
                });

                var fromStationLocator = "[id='fromDestinationAutocompleteCombobox']";
                var fromStationOptionsLocator = "[id='fromDestinationOption-0']";

                var toStationLocator = "[id='toDestinationAutocompleteCombobox']";
                var toStationOptionsLocator = "[id='toDestinationOption-0']";

                await page.FillAsync(fromStationLocator, departureStation);
                await page.ClickAsync(fromStationOptionsLocator);
                await page.FillAsync(toStationLocator, arrivalStation);
                await page.ClickAsync(toStationOptionsLocator);

                var responsePromise = await page.RunAndWaitForResponseAsync(async () =>
                {
                    await page.ClickAsync("[class='st-button st-button--primary']");
                }, request => request.Url.Contains("/gw-tps/api/v2/Journey"));


                if (responsePromise.Status != 200)
                {
                    throw new Exception($"Target website returned {responsePromise.Status}");
                }
                else
                {
                    //var jsonData = await responsePromise.JsonAsync();
                    //JourneyResponse? journeyResponse = JsonSerializer.Deserialize<JourneyResponse>(jsonData.ToString()!);
                    //Console.WriteLine(jsonData.ToString());
                    //Console.WriteLine(journeyResponse?.Api.ToString());
                    //return journeyResponse?.Journeys!;
                    var jsonData = await responsePromise.JsonAsync();
                    return jsonData;
                }
            }
            finally
            {
                await context.CloseAsync();
            }
        }

        public void ParseJsonData()
        {
            return;
        }
    }
}
