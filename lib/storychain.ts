export const storyAeneid = {
  id: 1315,
  name: "Story Aeneid Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Story",
    symbol: "IP",
  },
  rpcUrls: {
    default: { http: ["https://aeneid.storyrpc.io"] },
    public: {
      http: [
        "https://aeneid.storyrpc.io",
        "https://rpc.ankr.com/story_aeneid_testnet",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Story Aeneid Explorer",
      url: "https://aeneid.storyscan.io",
    },
  },
};
