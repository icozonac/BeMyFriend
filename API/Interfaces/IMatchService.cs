namespace API.Interfaces
{
    public interface IMatchService
    {
        Task<double> CalculateMatchScoreAsync(string user, string recipient);

    }
}
