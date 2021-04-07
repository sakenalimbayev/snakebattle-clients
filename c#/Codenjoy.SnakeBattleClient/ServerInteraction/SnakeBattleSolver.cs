using Codenjoy.SnakeBattleClient.AI;
using Codenjoy.SnakeBattleClient.Models;

namespace Codenjoy.SnakeBattleClient.ServerInteraction
{
    internal class SnakeBattleSolver : Solver
    {
        public SnakeBattleSolver(string server)
            : base(server)
        {
        }

        /// <summary>
        /// Calls each move to make decision what to do (next move)
        /// </summary>
        protected internal override string Get(Board board)
        {
            var bot = new SnakeBattleBot(board);
            { } return bot.GetNextMove();
        }
    }
}