using Codenjoy.SnakeBattleClient.Enums;
using Codenjoy.SnakeBattleClient.Models;

namespace Codenjoy.SnakeBattleClient.AI
{
    public class SnakeBattleBot
    {
        private readonly Board board;

        public SnakeBattleBot(Board board)
        {
            this.board = board;
        }

        public string GetNextMove()
        {
            return Direction.Right.ToString();
        }
    }
}