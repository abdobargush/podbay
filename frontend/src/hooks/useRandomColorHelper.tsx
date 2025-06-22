const colorClasses = [
  {
    background: "from-red-400/10 to-red-400/5 hover:to-red-400/10",
    color: "text-red-400 hover:text-red-500",
  },
  {
    background: "from-orange-400/10 to-orange-400/5 hover:to-orange-400/10",
    color: "text-orange-400 hover:text-orange-500",
  },
  {
    background: "from-yellow-400/10 to-yellow-400/5 hover:to-yellow-400/10",
    color: "text-yellow-400 hover:text-yellow-500",
  },
  {
    background: "from-green-400/10 to-green-400/5 hover:to-green-400/10",
    color: "text-green-400 hover:text-green-500",
  },
  {
    background: "from-blue-400/10 to-blue-400/5 hover:to-blue-400/10",
    color: "text-blue-400 hover:text-blue-500",
  },
  {
    background: "from-teal-400/10 to-teal-400/5 hover:to-teal-400/10",
    color: "text-teal-400 hover:text-teal-500",
  },
  {
    background: "from-violet-400/10 to-violet-400/5 hover:to-violet-400/10",
    color: "text-violet-400 hover:text-violet-500",
  },
];

const useRandomColorHelper = (number: number) => {
  const chosen = number % colorClasses.length;
  return {
    background: colorClasses[chosen].background,
    color: colorClasses[chosen].color,
  };
};

export default useRandomColorHelper;
