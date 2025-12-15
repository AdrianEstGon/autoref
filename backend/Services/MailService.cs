namespace AutoRef_API.Services;
using MailKit.Net.Smtp;

using MimeKit;

using System.Threading.Tasks;

public class MailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;

    public MailService()
    {
        _smtpServer = Environment.GetEnvironmentVariable("SMTP_SERVER") ?? "smtp.gmail.com";
        _smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587");
        _smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? "autorefasturias@gmail.com";
        _smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? "";
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("AutoRef", _smtpUsername));
        message.To.Add(new MailboxAddress("User", toEmail));
        message.Subject = subject;

        message.Body = new TextPart("plain") { Text = body };

        using (var client = new SmtpClient())
        {
            await client.ConnectAsync(_smtpServer, _smtpPort, false);
            await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}

