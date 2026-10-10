export const locationGroups = [
  { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"] },
  {
    state: "Andhra Pradesh — Cities",
    cities: [
      "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Kakinada", "Rajahmundry", "Kadapa",
      "Anantapur", "Amaravati", "Chittoor", "Ongole", "Eluru", "Vizianagaram", "Proddatur", "Tenali", "Madanapalle",
    ],
  },
  {
    state: "Andhra Pradesh — Small areas",
    cities: ["Srikakulam", "Bobbili", "Anakapalli", "Yelamanchili", "Tuni", "East Godavari", "West Godavari"],
  },
] as const;

export const neighborhoodsByLocation: Record<string, string[]> = {
  Hyderabad: ["Gachibowli", "Hitech City", "Madhapur", "Kukatpally", "Miyapur", "Kondapur", "Banjara Hills", "Jubilee Hills", "Secunderabad", "LB Nagar", "Uppal", "Begumpet", "Ameerpet", "Mehdipatnam", "Manikonda"],
  Srikakulam: ["Srikakulam Town", "Palasa", "Tekkali", "Ichapuram"],
  Bobbili: ["Bobbili Town", "Salur", "Parvathipuram"],
  Vizianagaram: ["Vizianagaram Town", "Gajapathinagaram", "Kothavalasa", "Nellimarla"],
  Visakhapatnam: ["MVP Colony", "Gajuwaka", "Madhurawada", "Dwaraka Nagar", "Seethammadhara", "NAD Junction", "Pendurthi", "Rushikonda"],
  Anakapalli: ["Anakapalli Town", "Narsipatnam", "Chodavaram", "Yelamanchili"],
  Yelamanchili: ["Yelamanchili Town", "Atchutapuram", "Rambilli"],
  Tuni: ["Tuni Town", "Payakaraopeta", "Nakkapalli"],
  Kakinada: ["Kakinada City", "Jagannaickpur", "Sarpavaram", "Ramanayyapeta", "Samalkot", "Pithapuram"],
  Rajahmundry: ["Danavaipeta", "Morampudi", "Dowleswaram", "Bommuru", "Kovvur"],
  Vijayawada: ["Benz Circle", "Bhavanipuram", "Labbipet", "Patamata", "Poranki", "Auto Nagar", "Kanuru", "Gannavaram"],
  Guntur: ["Brodipet", "Arundelpet", "Pattabhipuram", "Gorantla", "Nallapadu", "Mangalagiri"],
  Tirupati: ["Tirupati Town", "Renigunta", "Tiruchanur", "Chandragiri", "Srikalahasti"],
  "East Godavari": ["Amalapuram", "Mandapeta", "Peddapuram", "Ramachandrapuram", "Ravulapalem"],
  "West Godavari": ["Eluru", "Bhimavaram", "Tanuku", "Tadepalligudem", "Palakollu", "Narasapuram"],
  Anantapur: ["Anantapur City", "Guntakal", "Tadipatri", "Dharmavaram", "Hindupur"],
  Kurnool: ["Kurnool City", "Adoni", "Nandyal", "Yemmiganur", "Dhone"],
};
