"use client";

import React, { useState } from "react";

const WingoBetPage = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<
    { bet: string; amount: number; result: string; win: boolean }[]
  >([]);

  // 🎮 Admin-controlled result
  const [gameNumber, setGameNumber] = useState<number | null>(null);
  const [gameColor, setGameColor] = useState<string | null>(null);

  const bets = [
    { label: "Red", color: "bg-red-500 hover:bg-red-600" },
    { label: "Green", color: "bg-green-500 hover:bg-green-600" },
    { label: "Big", color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Small", color: "bg-yellow-500 hover:bg-yellow-600" },
  ];

  const numbers = Array.from({ length: 10 }, (_, i) => i);

  // 🎯 Start Bet
  const handleBet = () => {
    if (!selectedBet) {
      setMessage("⚠️ Please select your bet first!");
      return;
    }
    if (betAmount <= 0) {
      setMessage("⚠️ Bet amount must be greater than zero.");
      return;
    }
    if (balance < betAmount) {
      setMessage("❌ Insufficient balance.");
      return;
    }

    setBalance((prev) => prev - betAmount);
    setMessage("✅ Bet placed! Waiting for result...");
  };

  // 🧮 Decide Result (controlled by you)
  const handleSetResult = () => {
    if (gameNumber === null || !gameColor) {
      setMessage("⚠️ Please select both result number and color.");
      return;
    }

    if (!selectedBet) {
      setMessage("⚠️ No bet placed yet.");
      return;
    }

    // Check win condition
    let win = false;
    if (
      selectedBet === gameColor ||
      selectedBet === "Big" && gameNumber >= 5 ||
      selectedBet === "Small" && gameNumber <= 4 ||
      selectedBet === gameNumber.toString()
    ) {
      win = true;
    }

    if (win) {
      const winAmount = betAmount * 2;
      setBalance((prev) => prev + winAmount);
      setMessage(`🎉 You WON! Result: ${gameColor} ${gameNumber} (+${winAmount}$)`);
    } else {
      setMessage(`😢 You LOST. Result: ${gameColor} ${gameNumber}.`);
    }

    setHistory((prev) => [
      { bet: selectedBet, amount: betAmount, result: `${gameColor} ${gameNumber}`, win },
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1623] to-[#121E2E] text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🎯 Wingo Bet (Manual Control)</h1>

      {/* Balance */}
      <div className="bg-[#101D2D] px-6 py-3 rounded-2xl mb-6 shadow-lg flex items-center gap-3">
        <span className="text-lg">💰 Balance:</span>
        <span className="text-2xl font-bold text-green-400">${balance}</span>
      </div>

      {/* Bet Amount */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-32 px-4 py-2 rounded-lg bg-[#1C2838] border border-slate-600 text-white text-center focus:outline-none focus:ring-2 focus:ring-green-400"
          min={1}
        />
        <button
          onClick={() => setBetAmount(10)}
          className="px-4 py-2 bg-[#223146] hover:bg-[#2C3C4E] rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* Bet Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {bets.map((bet) => (
          <button
            key={bet.label}
            onClick={() => setSelectedBet(bet.label)}
            className={`py-3 px-6 rounded-2xl font-semibold text-lg shadow-md transition-all duration-300 
            ${bet.color} ${
              selectedBet === bet.label ? "ring-4 ring-white/50 scale-105" : ""
            }`}
          >
            {bet.label}
          </button>
        ))}
      </div>

      {/* Number Bets */}
      <div className="w-full max-w-lg bg-[#101D2D] p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-slate-200">
          Choose a Number
        </h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => setSelectedBet(num.toString())}
              className={`py-2 text-lg font-bold rounded-lg transition-all duration-300 
              ${
                selectedBet === num.toString()
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-105"
                  : "bg-[#1C2838] hover:bg-[#223146]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Place Bet */}
      <button
        onClick={handleBet}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
        px-10 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
      >
        Place Bet
      </button>

      {/* --- Game Control (Admin Section) --- */}
      <div className="w-full max-w-md mt-10 bg-[#0E1623] p-6 rounded-2xl shadow-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4 text-center text-yellow-400">
          🧠 Game Controller (You)
        </h2>

        {/* Select Color */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setGameColor("Red")}
            className={`px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 ${
              gameColor === "Red" ? "ring-2 ring-white" : ""
            }`}
          >
            Red
          </button>
          <button
            onClick={() => setGameColor("Green")}
            className={`px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 ${
              gameColor === "Green" ? "ring-2 ring-white" : ""
            }`}
          >
            Green
          </button>
        </div>

        {/* Select Number */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => setGameNumber(num)}
              className={`py-2 text-lg font-bold rounded-lg transition-all duration-300 ${
                gameNumber === num
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-105"
                  : "bg-[#1C2838] hover:bg-[#223146]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={handleSetResult}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 py-3 rounded-xl font-semibold text-lg transition-all"
        >
          🎮 Set Result
        </button>
      </div>

      {/* Messages */}
      {message && (
        <p className="mt-6 text-lg text-center bg-[#0E1623] px-6 py-3 rounded-xl border border-white/10 shadow-lg">
          {message}
        </p>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 w-full max-w-lg bg-[#101D2D] p-4 rounded-xl shadow-lg">
          <h3 className="text-xl mb-3 font-semibold">🧾 Bet History</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-left border-b border-slate-600">
                <th className="py-2">Bet</th>
                <th>Amount</th>
                <th>Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-slate-700">
                  <td className="py-2">{h.bet}</td>
                  <td>${h.amount}</td>
                  <td>{h.result}</td>
                  <td className={h.win ? "text-green-400" : "text-red-400"}>
                    {h.win ? "Win" : "Lose"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WingoBetPage;
