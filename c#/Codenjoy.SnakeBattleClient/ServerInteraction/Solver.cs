using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using Codenjoy.SnakeBattleClient.Models;

namespace Codenjoy.SnakeBattleClient.ServerInteraction
{
    public abstract class Solver
    {
        private const string ResponsePrefix = "board=";

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="server">server http address including email and code</param>
        public Solver(string server)
        {
            Console.OutputEncoding = Encoding.UTF8;
            ServerUrl = server;
        }

        public string ServerUrl { get; private set; }


        /// <summary>
        /// Set this property to true to finish playing
        /// </summary>
        public bool ShouldExit { get; protected set; }

        public void Play()
        {
            var url = GetWebSocketUrl(this.ServerUrl);
            WebSocket socket = null;

            try
            {
                socket = new WebSocket(new Uri(url));
                var shouldReconnect = false;
                socket.Connect();

                while (!ShouldExit)
                {
                    string response;
                    try
                    {
                        if (shouldReconnect)
                        {
                            socket = new WebSocket(new Uri(url));
                            socket.Connect();
                            shouldReconnect = false;
                        }
                        response = socket.Recv();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Couldn't connect to the server, will try later");
                        socket.Close();
                        shouldReconnect = true;
                        Thread.Sleep(3000);
                        continue;
                    }


                    if (!response.StartsWith(ResponsePrefix))
                    {
                        Console.WriteLine("Something strange is happening on the server... Response:\n{0}", response);
                        ShouldExit = true;
                    }
                    else
                    {
                        var boardString = response.Substring(ResponsePrefix.Length);
                        var board = new Board(boardString);

                        //Just print current state (gameBoard) to console
                        Console.Clear();
                        Console.SetCursorPosition(0, 0);
                        Console.WriteLine(board.ToString());

                        var action = Get(board);

                        Console.WriteLine("Answer: " + action);
                        Console.SetCursorPosition(0, 0);

                        socket.Send(action);
                    }
                }
            }
            finally
            {
                if (socket != null)
                {
                    socket.Dispose();
                }
            }
        }

        public static string GetWebSocketUrl(string serverUrl)
        {
            var uri = new Uri(serverUrl);

            var server = $"{uri.Host}:{uri.Port}";
            var userName = uri.Segments.Last();
            var code = HttpUtility.ParseQueryString(uri.Query).Get("code");

            return GetWebSocketUrl(userName, code, server);
        }
        private static string GetWebSocketUrl(string userName, string code, string server)
        {
            return string.Format("wss://{0}/codenjoy-contest/ws?user={1}&code={2}",
                            server,
                            Uri.EscapeDataString(userName),
                            code);
        }

        protected internal abstract string Get(Board gameBoard);

        /// <summary>
        /// Starts Snake's client shutdown.
        /// </summary>
        public void InitiateExit()
        {
            ShouldExit = true;
        }
    }
}