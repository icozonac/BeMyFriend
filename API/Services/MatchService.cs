using System.Text.RegularExpressions;
using API.Entities;
using API.Interfaces;

namespace API.Services
{
    public class MatchService : IMatchService
    {
        private readonly IUnitOfWork _uow;

        public MatchService(IUnitOfWork unitOfWork)
        {
            _uow = unitOfWork;
        }

        public async Task<double> CalculateMatchScoreAsync(string _user, string _recipient)
        {
            var result = 0.0;

            var user = await _uow.UserRepository.GetUserByUserNameAsync(_user);
            var recipient = await _uow.UserRepository.GetUserByUserNameAsync(_recipient);

            if (!string.IsNullOrEmpty(user.Interests) && !string.IsNullOrEmpty(recipient.Interests))
            {
                var interestScore = await CalculateTextSimilarityScore(user.Interests, recipient.Interests);
                result += interestScore * 0.5; // 50% weight for interests
            }

            var ageScore = CalculateAgeScore(user.DateOfBirth, recipient.DateOfBirth);
            result += ageScore * 0.3; // 30% weight for age

            if (user.City != null && recipient.City != null && user.Country != null && recipient.Country != null)
            {
                double locationScore = CalculateLocationScore(user.City, recipient.City, user.Country, recipient.Country);
                result += locationScore * 0.2; // 20% weight for location
            }

            return result * 100;
        }

        private double CalculateAgeScore(DateOnly userDob, DateOnly recipientDob)
        {
            var ageDifference = Math.Abs(userDob.Year - recipientDob.Year);

            var normalizedAgeDifference = Math.Min(1, (double)ageDifference / 7);

            return 1 - normalizedAgeDifference;
        }

        private double CalculateLocationScore(string userCity, string recipientCity, string userCountry, string recipientCountry)
        {
            if (userCity.Equals(recipientCity, StringComparison.OrdinalIgnoreCase))
            {
                return 1.0;
            }
            else if (userCountry.Equals(recipientCountry, StringComparison.OrdinalIgnoreCase))
            {
                return 0.5;
            }
            else
            {
                return 0.0;
            }
        }

        private async Task<double> CalculateTextSimilarityScore(string text1, string text2)
        {
            var cosineSimilarity = await CalculateCosineSimilarity(text1, text2);
            return cosineSimilarity;
        }

        private static Task<double> CalculateCosineSimilarity(string text1, string text2)
        {
            var text1Words = TokenizeAndClean(text1);
            var text2Words = TokenizeAndClean(text2);

            var allWords = text1Words.Union(text2Words).Distinct().ToArray();
            var text1Vector = allWords.Select(word => text1Words.Count(i => i == word)).ToArray();
            var text2Vector = allWords.Select(word => text2Words.Count(i => i == word)).ToArray();

            double dotProduct = text1Vector.Zip(text2Vector, (a, b) => a * b).Sum();
            double magnitudeA = Math.Sqrt(text1Vector.Sum(val => Math.Pow(val, 2)));
            double magnitudeB = Math.Sqrt(text2Vector.Sum(val => Math.Pow(val, 2)));

            if (magnitudeA == 0 || magnitudeB == 0)
                return Task.FromResult(0.0);

            double cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
            return Task.FromResult(cosineSimilarity);
        }

        private static List<string> TokenizeAndClean(string text)
        {
            var stopWords = new HashSet<string> { "a", "and", "the", "in", "of", "on", "at", "to", "for", "with", "by", "about", "as", "an", "is", "are" };
            var words = Regex.Split(text.ToLower(), @"\W+").Where(w => !stopWords.Contains(w) && w.Length > 1).ToList();
            return words;
        }
    }
}
