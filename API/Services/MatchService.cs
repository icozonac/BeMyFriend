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

            var ageScore =  await CalculateAgeScore(user.DateOfBirth, recipient.DateOfBirth);


            if (user.City != null && recipient.City != null)
            { 
                var locationScore = await CalculateLocationScore(user.City, recipient.City);
                result += locationScore;
            }
             
            if (user.Interests != null && recipient.Interests != null)
            {
                var interestScore = await CalculateInterestScore(user.Interests, recipient.Interests);
                result += interestScore;
            }
            
                

            return (result + ageScore) *100/3;
            
        }


        private async Task<double> CalculateAgeScore(DateOnly userDob, DateOnly recipientDob)
        {
            var ageDifference = Math.Abs(userDob.Year - recipientDob.Year);

            var normalizedAgeDifference = Math.Min(1, (double)ageDifference / 5);

            return 1 - normalizedAgeDifference;

        }

        private Task<double> CalculateLocationScore(string userCity, string recipientCity)
        {
            if (userCity == recipientCity) return Task.FromResult<double>(1);

            return Task.FromResult(0.5);
        }


        private async Task<double> CalculateInterestScore(string userInterest, string recipientInterest)
        {
            userInterest = userInterest.ToLower() ?? "";
            recipientInterest = recipientInterest.ToLower() ?? "";

            var jaccardIndex = await CalculateJaccardIndex(userInterest, recipientInterest);

            return jaccardIndex;

        }

        private static Task<double> CalculateJaccardIndex(string userInterest, string recipientInterest)
        {
            var userInterests = new HashSet<string>(userInterest.Split(' ', StringSplitOptions.RemoveEmptyEntries));
            var recipientInterests = new HashSet<string>(recipientInterest.Split(' ', StringSplitOptions.RemoveEmptyEntries));

            var intersection = userInterests.Intersect(recipientInterests).Count();

            var jaccardIndex = (double)intersection / (userInterests.Count + recipientInterests.Count - intersection);

            return Task.FromResult(jaccardIndex);
        }


    }
}
