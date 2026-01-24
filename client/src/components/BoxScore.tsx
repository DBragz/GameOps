import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Game, Player, Team } from "@shared/schema";

interface BoxScoreProps {
  game: Game;
}

export function BoxScore({ game }: BoxScoreProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <h2 className="text-lg font-semibold">Box Score</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          data-testid="button-print-boxscore"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <div className="print-only mb-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">GameOps Box Score</h1>
          <p className="text-sm">
            {game.awayTeam.name} vs {game.homeTeam.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Final Score: {game.awayTeam.score} - {game.homeTeam.score}
          </p>
        </div>
      </div>

      <TeamBoxScore team={game.awayTeam} isHome={false} />
      <TeamBoxScore team={game.homeTeam} isHome={true} />
    </div>
  );
}

interface TeamBoxScoreProps {
  team: Team;
  isHome: boolean;
}

function TeamBoxScore({ team, isHome }: TeamBoxScoreProps) {
  const calculatePercentage = (made: number, attempted: number) => {
    if (attempted === 0) return "-";
    return `${((made / attempted) * 100).toFixed(0)}%`;
  };

  const teamTotals = team.players.reduce(
    (acc, player) => ({
      points: acc.points + player.stats.points,
      fgm: acc.fgm + player.stats.fieldGoalsMade,
      fga: acc.fga + player.stats.fieldGoalsAttempted,
      tpm: acc.tpm + player.stats.threePointersMade,
      tpa: acc.tpa + player.stats.threePointersAttempted,
      ftm: acc.ftm + player.stats.freeThrowsMade,
      fta: acc.fta + player.stats.freeThrowsAttempted,
      oreb: acc.oreb + player.stats.offensiveRebounds,
      dreb: acc.dreb + player.stats.defensiveRebounds,
      ast: acc.ast + player.stats.assists,
      stl: acc.stl + player.stats.steals,
      blk: acc.blk + player.stats.blocks,
      to: acc.to + player.stats.turnovers,
      fouls: acc.fouls + player.fouls,
    }),
    {
      points: 0,
      fgm: 0,
      fga: 0,
      tpm: 0,
      tpa: 0,
      ftm: 0,
      fta: 0,
      oreb: 0,
      dreb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      to: 0,
      fouls: 0,
    }
  );

  return (
    <Card className="overflow-hidden">
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: team.color }}
      >
        <span className="text-white font-bold text-lg">{team.name}</span>
        <span className="text-white/80 text-sm">({team.abbreviation})</span>
        <span className="ml-auto text-white font-bold text-2xl tabular-nums">
          {team.score}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-center w-[50px]">PTS</TableHead>
              <TableHead className="text-center w-[60px]">FG</TableHead>
              <TableHead className="text-center w-[60px]">3PT</TableHead>
              <TableHead className="text-center w-[60px]">FT</TableHead>
              <TableHead className="text-center w-[40px]">OREB</TableHead>
              <TableHead className="text-center w-[40px]">DREB</TableHead>
              <TableHead className="text-center w-[40px]">REB</TableHead>
              <TableHead className="text-center w-[40px]">AST</TableHead>
              <TableHead className="text-center w-[40px]">STL</TableHead>
              <TableHead className="text-center w-[40px]">BLK</TableHead>
              <TableHead className="text-center w-[40px]">TO</TableHead>
              <TableHead className="text-center w-[40px]">PF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.players.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
            <TableRow className="bg-muted/30 font-medium">
              <TableCell></TableCell>
              <TableCell>TEAM</TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.points}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.fgm}/{teamTotals.fga}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.tpm}/{teamTotals.tpa}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.ftm}/{teamTotals.fta}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.oreb}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.dreb}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.oreb + teamTotals.dreb}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.ast}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.stl}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.blk}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.to}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {teamTotals.fouls}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="px-4 py-2 bg-muted/20 border-t border-card-border text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span>
            FG%:{" "}
            {calculatePercentage(teamTotals.fgm, teamTotals.fga)}
          </span>
          <span>
            3P%:{" "}
            {calculatePercentage(teamTotals.tpm, teamTotals.tpa)}
          </span>
          <span>
            FT%:{" "}
            {calculatePercentage(teamTotals.ftm, teamTotals.fta)}
          </span>
          <span>Team Fouls: {team.teamFouls}</span>
          <span>Timeouts: {team.timeoutsRemaining}</span>
        </div>
      </div>
    </Card>
  );
}

interface PlayerRowProps {
  player: Player;
}

function PlayerRow({ player }: PlayerRowProps) {
  const totalRebounds =
    player.stats.offensiveRebounds + player.stats.defensiveRebounds;

  return (
    <TableRow
      className={player.fouls >= 5 ? "opacity-50" : ""}
      data-testid={`boxscore-row-${player.id}`}
    >
      <TableCell className="font-mono text-sm">{player.number}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{player.name}</span>
          <span className="text-xs text-muted-foreground">
            {player.position}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center font-bold tabular-nums">
        {player.stats.points}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.fieldGoalsMade}/{player.stats.fieldGoalsAttempted}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.threePointersMade}/{player.stats.threePointersAttempted}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.freeThrowsMade}/{player.stats.freeThrowsAttempted}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.offensiveRebounds}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.defensiveRebounds}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {totalRebounds}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.assists}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.steals}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.blocks}
      </TableCell>
      <TableCell className="text-center tabular-nums text-sm">
        {player.stats.turnovers}
      </TableCell>
      <TableCell
        className={`text-center tabular-nums text-sm ${
          player.fouls >= 4 ? "text-destructive font-bold" : ""
        }`}
      >
        {player.fouls}
      </TableCell>
    </TableRow>
  );
}
