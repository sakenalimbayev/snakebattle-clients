using Codenjoy.SnakeBattleClient.ServerInteraction;
using Microsoft.Extensions.Configuration;
using System.Threading;

namespace Codenjoy.SnakeBattleClient
{
    class Program
    {
        static string ServerUrl;

        static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            ServerUrl = config.GetSection("ServerUrl").Value;

            // creating custom Snake's Ai client
            var snakeBattle = new SnakeBattleSolver(ServerUrl);

            // starting thread with playing Snake
            var thread = new Thread(snakeBattle.Play);
            thread.Start();
            thread.Join();
        }
    }
}
