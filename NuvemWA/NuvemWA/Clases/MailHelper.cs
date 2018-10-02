namespace NuvemWA.Clases
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Mail;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Timers;
    using Utilidades;

    public static class MailHelper
    {
        private static List<NuvemMailMessage> _Queue = new List<NuvemMailMessage>();
        private static System.Timers.Timer _enqueueTimer;
        private static int _enqueueInterval = 10000;
        private static int _enqueueDelay = 3000;

        static MailHelper()
        {
            _enqueueTimer = new System.Timers.Timer();
            _enqueueTimer.Interval = _enqueueInterval;
            _enqueueTimer.Elapsed += _enqueueTimer_Elapsed;
            _enqueueTimer.Start();
        }

        static void _enqueueTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            ProcessEnqueue();
        }
        public static void SendMail(NuvemMailMessage msg)
        {
            /*
             * Cliente SMTP
             * Gmail:  smtp.gmail.com  puerto:587
             * Hotmail: smtp.liva.com  puerto:25
             */
            SmtpClient client = new SmtpClient(Properties.Settings.Default.SMTP_SERVER, Properties.Settings.Default.SMTP_PORT);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(Properties.Settings.Default.SMTP_EMAIL, Properties.Settings.Default.SMTP_PWD);

            try
            {
                client.Send(msg);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = MailHelper." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
            }
        }
        public static Task SendMailAsync(NuvemMailMessage msg)
        {
            /*
             * Cliente SMTP
             * Gmail:  smtp.gmail.com  puerto:587
             * Hotmail: smtp.liva.com  puerto:25
             */
            SmtpClient client = new SmtpClient(Properties.Settings.Default.SMTP_SERVER, Properties.Settings.Default.SMTP_PORT);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(Properties.Settings.Default.SMTP_EMAIL, Properties.Settings.Default.SMTP_PWD);

            //try
            //{
            TaskCompletionSource<object> tcs = new TaskCompletionSource<object>();
            Guid sendGuid = Guid.NewGuid();

            SendCompletedEventHandler handler = null;
            handler = (o, ea) =>
            {
                if (ea.UserState is Guid && ((Guid)ea.UserState) == sendGuid)
                {
                    client.SendCompleted -= handler;
                    if (ea.Cancelled)
                    {
                        tcs.SetCanceled();
                    }
                    else if (ea.Error != null)
                    {
                        tcs.SetException(ea.Error);
                    }
                    else
                    {
                        tcs.SetResult(null);
                    }
                }
            };

            client.SendCompleted += handler;
            client.SendAsync(msg, sendGuid);
            return tcs.Task;

            /* Enviar */
            //Task sendTask = mail.SendMailAsync(msg); //client.SendAsync(message);
            //sendTask.ContinueWith(task =>
            //{
            //    if (task.IsFaulted)
            //    {
            //        Exception ex = task.Exception.InnerExceptions.First();
            //        //handle error
            //    }
            //    else if (task.IsCanceled)
            //    {
            //        //handle cancellation
            //    }
            //    else
            //    {
            //        //task completed successfully
            //    }
            //});
        }
        public static void SendToEnqueue(string Subject, List<string> Emails, string msgBody, string from)
        {
            NuvemMailMessage msg = new NuvemMailMessage();

            foreach (var to in Emails)
            {
                msg.To.Add(new MailAddress(to));
            }

            msg.From = new MailAddress(Properties.Settings.Default.SMTP_EMAIL, from);
            msg.Body = msgBody;
            msg.IsBodyHtml = true;

            _Queue.Add(msg);
        }
        static void ProcessEnqueue()
        {
            _enqueueTimer.Stop();

            var lista = _Queue.FindAll(w => w.Processed == false);

            foreach (var msg in lista)
            {
                SendMail(msg);
                msg.Processed = true;
                Thread.Sleep(_enqueueDelay);
            }

            _Queue.RemoveAll(w => w.Processed);

            _enqueueTimer.Start();
        }
    }

    public class NuvemMailMessage : MailMessage
    {
        public bool Processed { get; set; }
    }
}