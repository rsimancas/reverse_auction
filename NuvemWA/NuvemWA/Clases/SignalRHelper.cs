namespace NuvemWA.Clases
{
    using Microsoft.AspNet.SignalR.Client;
    using Newtonsoft.Json;
    using Utilidades;

    public static class SignalRHelper
    {
        static Connection _connection { get; set; }

        static SignalRHelper()
        {
            string ServiceUri = Properties.Settings.Default.SIGNALR_SERVER;
            _connection = new Connection(ServiceUri, "name=dyz");
            _connection.Received += connection_Received;
            _connection.StateChanged += connection_StateChanged;
            _connection.Start();
            //_connection.Start().Wait();
            //string inputMsg;
            //while (!string.IsNullOrEmpty(inputMsg = Console.ReadLine()))
            //{
            //    _connection.Send(inputMsg).Wait();
            //}
            //_connection.Stop();
        }
        static void connection_StateChanged(StateChange state)
        {
            if (state.NewState == ConnectionState.Connected)
            {
                LogManager.Write("Connected.");
            }
        }
        static void connection_Received(string data)
        {

        }

        public static void SendData(BroadcastMessage msg)
        {
            _connection.Send(JsonConvert.SerializeObject(msg));
        }
    }

    public class BroadcastMessage
    {
        public string CommandType { get; set; }
        public string CommandText { get; set; }
    }
}