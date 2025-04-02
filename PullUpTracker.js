import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const PullUpTracker = () => {
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem("pullupData")) || [];
  });
  const [name, setName] = useState("");
  const [pullups, setPullups] = useState("");
  const [date, setDate] = useState("");
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  });
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    localStorage.setItem("pullupData", JSON.stringify(data));
    localStorage.setItem("users", JSON.stringify(users));
  }, [data, users]);

  const addEntry = () => {
    if (!name || !pullups || !date) return;
    setData([...data, { name, pullups: Number(pullups), date }]);
    setPullups("");
    setDate("");
  };

  const addUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const sortedLeaderboard = [...data].reduce((acc, entry) => {
    acc[entry.name] = (acc[entry.name] || 0) + entry.pullups;
    return acc;
  }, {});

  const leaderboard = Object.entries(sortedLeaderboard)
    .sort((a, b) => b[1] - a[1])
    .map(([name, pullups], index) => ({ name, pullups, rank: index + 1 }));

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white min-h-screen">
      <Card className="bg-gray-800">
        <CardContent className="space-y-2">
          <Input className="bg-gray-700 text-white" type="text" placeholder="Nieuwe naam toevoegen" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
          <Button onClick={addUser}>Naam toevoegen</Button>
          <Select onValueChange={setName}>
            <SelectTrigger className="bg-gray-700 text-white">{name || "Selecteer naam"}</SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {users.map((user) => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input className="bg-gray-700 text-white" type="number" placeholder="Aantal pull-ups" value={pullups} onChange={(e) => setPullups(e.target.value)} />
          <Input className="bg-gray-700 text-white" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button onClick={addEntry}>Toevoegen</Button>
        </CardContent>
      </Card>
      <Card className="bg-gray-800">
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              {users.map((user, index) => (
                <Line key={user} type="monotone" dataKey="pullups" data={data.filter(d => d.name === user)} name={user} stroke={`hsl(${index * 60}, 70%, 50%)`} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-gray-800">
        <CardContent>
          <h2 className="text-lg font-bold">Ranglijst</h2>
          <ul>
            {leaderboard.map(({ name, pullups, rank }) => (
              <li key={name} className="py-1">{rank}. {name} - {pullups} pull-ups</li>
            ))}
          </ul>
          <h3 className="text-lg font-bold mt-4">Totaal aantal pull-ups per persoon</h3>
          <ul>
            {Object.entries(sortedLeaderboard).map(([name, total]) => (
              <li key={name}>{name}: {total} pull-ups</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PullUpTracker;
