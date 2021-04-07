using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Codenjoy.SnakeBattleClient.ServerInteraction
{
    public class WebSocket : IDisposable
    {
        private Uri serverUri;
        private ClientWebSocket ws;

        public WebSocket(Uri url)
        {
            serverUri = url;

            string protocol = serverUri.Scheme;
            if (!protocol.Equals("ws") && !protocol.Equals("wss"))
                throw new ArgumentException("Unsupported protocol: " + protocol);

            ws = new ClientWebSocket();
        }

        public void Connect()
        {
            Task task = ws.ConnectAsync(serverUri, CancellationToken.None);
            task.Wait();
        }

        public void Send(string str)
        {
            ArraySegment<byte> bytesToSend = new ArraySegment<byte>(
                        Encoding.UTF8.GetBytes(str));
            Task task = ws.SendAsync(
                bytesToSend, WebSocketMessageType.Text,
                true, CancellationToken.None);
            task.Wait();
        }

        public string Recv()
        {
            ArraySegment<byte> bytesReceived = new ArraySegment<byte>(new byte[10240]);
            Task<WebSocketReceiveResult> task = ws.ReceiveAsync(
                bytesReceived, CancellationToken.None);
            task.Wait();
            WebSocketReceiveResult result = task.Result;

            return Encoding.UTF8.GetString(bytesReceived.Array, 0, result.Count);
        }

        public void Close()
        {
            ws.Dispose();
        }

        public void Dispose()
        {
            Close();
        }
    }
}