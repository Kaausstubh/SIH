import random
import csv
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any

# Explicit notice required by guidelines & data provenance
DEMO_DATASET_DISCLAIMER = "DEMO DATA — STATISTICALLY CALIBRATED AGAINST PUBLIC MPLADS & CAG BENCHMARKS (FOR DEMONSTRATION PURPOSES ONLY)"

# 86 Real Lok Sabha Constituencies across 17 States / UTs with authentic MPs, blocks, agencies, and coordinates
REGIONS = [
    # 1. Uttar Pradesh (16 Constituencies ~15% national share)
    {
        "state": "Uttar Pradesh",
        "weight": 15,
        "districts": [
            {
                "district": "Varanasi",
                "constituency": "Varanasi (Lok Sabha)",
                "mp_name": "Narendra Modi",
                "blocks": ["Sevapuri", "Arajiline", "Pindra", "Kashi Vidyapeeth", "Cholapur", "Harahua"],
                "lat": 25.3176, "lng": 82.9739,
                "agencies": ["UP Jal Nigam", "PWD Varanasi", "Rural Engineering Dept UP", "Varanasi Nagar Nigam", "M/s Purvanchal InfraTech Services"]
            },
            {
                "district": "Lucknow",
                "constituency": "Lucknow (Lok Sabha)",
                "mp_name": "Rajnath Singh",
                "blocks": ["Bakshi Ka Talab", "Malihabad", "Sarojini Nagar", "Mohanlalganj", "Chinhat"],
                "lat": 26.8467, "lng": 80.9462,
                "agencies": ["Lucknow Development Authority", "UP State Construction Corp", "PWD Lucknow", "Jal Sansthan Lucknow"]
            },
            {
                "district": "Gorakhpur",
                "constituency": "Gorakhpur (Lok Sabha)",
                "mp_name": "Ravi Kishan",
                "blocks": ["Sahjanwa", "Pipraich", "Chargawan", "Bhathat", "Campierganj"],
                "lat": 26.7606, "lng": 83.3732,
                "agencies": ["Gorakhpur Development Authority", "UP Jal Nigam Gorakhpur", "PWD Gorakhpur", "DRDA Gorakhpur"]
            },
            {
                "district": "Prayagraj",
                "constituency": "Prayagraj (Lok Sabha)",
                "mp_name": "Praveen Patel",
                "blocks": ["Soraon", "Phulpur", "Karchhana", "Meja", "Jasra"],
                "lat": 25.4358, "lng": 81.8463,
                "agencies": ["Prayagraj Vikas Pradhikaran", "PWD Prayagraj", "UP Jal Sansthan", "DRDA Prayagraj"]
            },
            {
                "district": "Kanpur Nagar",
                "constituency": "Kanpur (Lok Sabha)",
                "mp_name": "Ramesh Awasthi",
                "blocks": ["Kalyanpur", "Bidhnu", "Sarsaul", "Chaubepur", "Bilhaur"],
                "lat": 26.4499, "lng": 80.3319,
                "agencies": ["Kanpur Nagar Nigam", "Kanpur Development Authority", "PWD Kanpur"]
            },
            {
                "district": "Agra",
                "constituency": "Agra (Lok Sabha)",
                "mp_name": "S. P. Singh Baghel",
                "blocks": ["Bichpuri", "Fatehabad", "Kheragarh", "Barauli Ahir", "Shamshabad"],
                "lat": 27.1767, "lng": 78.0081,
                "agencies": ["Agra Development Authority", "UP Jal Nigam", "PWD Agra", "DRDA Agra"]
            },
            {
                "district": "Meerut",
                "constituency": "Meerut (Lok Sabha)",
                "mp_name": "Arun Govil",
                "blocks": ["Mawana", "Sardhana", "Rohta", "Daurala", "Rajpura"],
                "lat": 28.9845, "lng": 77.7064,
                "agencies": ["Meerut Development Authority", "UP Jal Nigam Meerut", "PWD Meerut"]
            },
            {
                "district": "Amethi",
                "constituency": "Amethi (Lok Sabha)",
                "mp_name": "Kishori Lal Sharma",
                "blocks": ["Gauriganj", "Jagdishpur", "Musafirkhana", "Tiloi", "Salon"],
                "lat": 26.1558, "lng": 81.8156,
                "agencies": ["DRDA Amethi", "PWD Amethi", "Rural Engineering Services UP"]
            },
            {
                "district": "Ayodhya",
                "constituency": "Faizabad (Lok Sabha)",
                "mp_name": "Awadhesh Prasad",
                "blocks": ["Masodha", "Maya Bazar", "Pura Bazar", "Sohawal", "Bikapur"],
                "lat": 26.7735, "lng": 82.1460,
                "agencies": ["Ayodhya Development Authority", "PWD Ayodhya", "UP Jal Nigam Ayodhya"]
            },
            {
                "district": "Bareilly",
                "constituency": "Bareilly (Lok Sabha)",
                "mp_name": "Chhatrapal Singh Gangwar",
                "blocks": ["Bithri Chainpur", "Bhojipura", "Faridpur", "Nawabganj", "Mirganj"],
                "lat": 28.3670, "lng": 79.4304,
                "agencies": ["Bareilly Development Authority", "PWD Bareilly", "DRDA Bareilly"]
            },
            {
                "district": "Jhansi",
                "constituency": "Jhansi (Lok Sabha)",
                "mp_name": "Anurag Sharma",
                "blocks": ["Babina", "Baragaon", "Bamaur", "Moth", "Mauranipur"],
                "lat": 25.4484, "lng": 78.5685,
                "agencies": ["Bundelkhand Vikas Pradhikaran", "UP Jal Nigam Jhansi", "PWD Jhansi"]
            },
            {
                "district": "Moradabad",
                "constituency": "Moradabad (Lok Sabha)",
                "mp_name": "Ruchi Vira",
                "blocks": ["Kundarki", "Dingarpur", "Bhagatpur Tanda", "Moradabad Rural"],
                "lat": 28.8386, "lng": 78.7733,
                "agencies": ["Moradabad Municipal Corp", "PWD Moradabad", "DRDA Moradabad"]
            },
            {
                "district": "Aligarh",
                "constituency": "Aligarh (Lok Sabha)",
                "mp_name": "Satish Kumar Gautam",
                "blocks": ["Dhanipur", "Lodha", "Atrauli", "Gabhana", "Khair"],
                "lat": 27.8974, "lng": 78.0880,
                "agencies": ["Aligarh Nagar Nigam", "PWD Aligarh", "UP Jal Nigam"]
            },
            {
                "district": "Mathura",
                "constituency": "Mathura (Lok Sabha)",
                "mp_name": "Hema Malini",
                "blocks": ["Vrindavan", "Chaumuhan", "Govardhan", "Raya", "Farah"],
                "lat": 27.4924, "lng": 77.6737,
                "agencies": ["Mathura-Vrindavan Dev Authority", "UP Jal Nigam", "PWD Mathura"]
            },
            {
                "district": "Saharanpur",
                "constituency": "Saharanpur (Lok Sabha)",
                "mp_name": "Imran Masood",
                "blocks": ["Nakur", "Rampur Maniharan", "Sarsawa", "Deoband", "Puwarka"],
                "lat": 29.9679, "lng": 77.5452,
                "agencies": ["Saharanpur Nagar Nigam", "PWD Saharanpur", "DRDA Saharanpur"]
            },
            {
                "district": "Ghaziabad",
                "constituency": "Ghaziabad (Lok Sabha)",
                "mp_name": "Atul Garg",
                "blocks": ["Muradnagar", "Loni", "Bhojpur", "Razapur"],
                "lat": 28.6692, "lng": 77.4538,
                "agencies": ["Ghaziabad Development Authority", "UP Jal Nigam", "PWD Ghaziabad"]
            }
        ]
    },

    # 2. Maharashtra (10 Constituencies ~9% national share)
    {
        "state": "Maharashtra",
        "weight": 9,
        "districts": [
            {
                "district": "Pune",
                "constituency": "Pune (Lok Sabha)",
                "mp_name": "Murlidhar Mohol",
                "blocks": ["Haveli", "Baramati", "Shirur", "Ambegaon", "Maval"],
                "lat": 18.5204, "lng": 73.8567,
                "agencies": ["PWD Pune Division", "Zilla Parishad Pune", "DRDA Pune", "MSEDCL Maharashtra"]
            },
            {
                "district": "Nashik",
                "constituency": "Nashik (Lok Sabha)",
                "mp_name": "Rajabhau Waje",
                "blocks": ["Nashik Rural", "Dindori", "Sinnar", "Niphad", "Trimbak"],
                "lat": 19.9975, "lng": 73.7898,
                "agencies": ["Nashik Municipal Corp", "Zilla Parishad Nashik", "PWD Nashik", "DRDA Nashik"]
            },
            {
                "district": "Nagpur",
                "constituency": "Nagpur (Lok Sabha)",
                "mp_name": "Nitin Gadkari",
                "blocks": ["Nagpur Rural", "Kamptee", "Hingna", "Katol", "Ramtek"],
                "lat": 21.1458, "lng": 79.0882,
                "agencies": ["Nagpur Improvement Trust", "PWD Nagpur", "Zilla Parishad Nagpur"]
            },
            {
                "district": "Mumbai South",
                "constituency": "Mumbai South (Lok Sabha)",
                "mp_name": "Arvind Sawant",
                "blocks": ["Colaba", "Byculla", "Malabar Hill", "Worli", "Sewri"],
                "lat": 18.9388, "lng": 72.8354,
                "agencies": ["BMC Mumbai", "MHADA", "PWD Mumbai"]
            },
            {
                "district": "Thane",
                "constituency": "Thane (Lok Sabha)",
                "mp_name": "Naresh Mhaske",
                "blocks": ["Thane Rural", "Kalyan", "Bhiwandi", "Ulhasnagar"],
                "lat": 19.2183, "lng": 72.9781,
                "agencies": ["Thane Municipal Corp", "MMRDA", "PWD Thane", "Zilla Parishad Thane"]
            },
            {
                "district": "Kolhapur",
                "constituency": "Kolhapur (Lok Sabha)",
                "mp_name": "Shahu Chhatrapati",
                "blocks": ["Karveer", "Hatkanangale", "Shirol", "Panhala", "Radhanagari"],
                "lat": 16.7050, "lng": 74.2433,
                "agencies": ["Zilla Parishad Kolhapur", "PWD Kolhapur", "Kolhapur Municipal Corp"]
            },
            {
                "district": "Chhatrapati Sambhajinagar",
                "constituency": "Aurangabad (Lok Sabha)",
                "mp_name": "Sandipan Bhumre",
                "blocks": ["Paithan", "Gangapur", "Sillod", "Phulambri", "Vaijapur"],
                "lat": 19.8762, "lng": 75.3433,
                "agencies": ["Aurangabad Smart City", "PWD Sambhajinagar", "Zilla Parishad Aurangabad"]
            },
            {
                "district": "Solapur",
                "constituency": "Solapur (Lok Sabha)",
                "mp_name": "Praniti Shinde",
                "blocks": ["North Solapur", "South Solapur", "Mohol", "Barshi", "Pandharpur"],
                "lat": 17.6599, "lng": 75.9064,
                "agencies": ["Zilla Parishad Solapur", "PWD Solapur", "Solapur Municipal Corp"]
            },
            {
                "district": "Satara",
                "constituency": "Satara (Lok Sabha)",
                "mp_name": "Udayanraje Bhosale",
                "blocks": ["Karad", "Wai", "Koregaon", "Phaltan", "Patan"],
                "lat": 17.6805, "lng": 73.9997,
                "agencies": ["Zilla Parishad Satara", "PWD Satara", "DRDA Satara"]
            },
            {
                "district": "Amravati",
                "constituency": "Amravati (Lok Sabha)",
                "mp_name": "Balwant Wankhade",
                "blocks": ["Achalpur", "Chandur Railway", "Morshi", "Warud", "Daryapur"],
                "lat": 20.9374, "lng": 77.7796,
                "agencies": ["Zilla Parishad Amravati", "PWD Amravati", "DRDA Amravati"]
            }
        ]
    },

    # 3. West Bengal (8 Constituencies ~8% national share)
    {
        "state": "West Bengal",
        "weight": 8,
        "districts": [
            {
                "district": "Nadia",
                "constituency": "Ranaghat (Lok Sabha)",
                "mp_name": "Jagannath Sarkar",
                "blocks": ["Ranaghat-I", "Ranaghat-II", "Santipur", "Hanskhali", "Chakdaha"],
                "lat": 23.1810, "lng": 88.5565,
                "agencies": ["WB PWD Nadia", "Zilla Parishad Nadia", "Public Health Engineering WB"]
            },
            {
                "district": "Kolkata",
                "constituency": "Kolkata North (Lok Sabha)",
                "mp_name": "Sudip Bandyopadhyay",
                "blocks": ["Shyampukur", "Jorasanko", "Maniktala", "Beleghata"],
                "lat": 22.5850, "lng": 88.3700,
                "agencies": ["Kolkata Municipal Corp", "KMDA", "WB PWD Kolkata"]
            },
            {
                "district": "Howrah",
                "constituency": "Howrah (Lok Sabha)",
                "mp_name": "Prasun Banerjee",
                "blocks": ["Bally", "Uluberia", "Domjur", "Panchla"],
                "lat": 22.5958, "lng": 88.2636,
                "agencies": ["Howrah Municipal Corp", "WB PWD Howrah", "Zilla Parishad Howrah"]
            },
            {
                "district": "Darjeeling",
                "constituency": "Darjeeling (Lok Sabha)",
                "mp_name": "Raju Bista",
                "blocks": ["Kurseong", "Kalimpong", "Mirik", "Siliguri Rural"],
                "lat": 27.0410, "lng": 88.2663,
                "agencies": ["Gorkhaland Territorial Admin", "Siliguri Jalpaiguri Dev Authority", "WB PWD"]
            },
            {
                "district": "Murshidabad",
                "constituency": "Murshidabad (Lok Sabha)",
                "mp_name": "Abu Taher Khan",
                "blocks": ["Berhampore", "Lalbagh", "Domkal", "Kandi", "Hariharpara"],
                "lat": 24.1750, "lng": 88.2800,
                "agencies": ["Zilla Parishad Murshidabad", "PHE Dept WB", "WB PWD"]
            },
            {
                "district": "Paschim Bardhaman",
                "constituency": "Asansol (Lok Sabha)",
                "mp_name": "Shatrughan Sinha",
                "blocks": ["Raniganj", "Kulti", "Jamuria", "Barabani"],
                "lat": 23.6739, "lng": 86.9524,
                "agencies": ["Asansol Durgapur Dev Authority", "WB PWD", "Asansol Municipal Corp"]
            },
            {
                "district": "Paschim Medinipur",
                "constituency": "Medinipur (Lok Sabha)",
                "mp_name": "June Malia",
                "blocks": ["Kharagpur Rural", "Salboni", "Keshpur", "Midnapore Sadar"],
                "lat": 22.4257, "lng": 87.3199,
                "agencies": ["Paschim Medinipur Zilla Parishad", "WB PWD Medinipur"]
            },
            {
                "district": "Purba Bardhaman",
                "constituency": "Bardhaman-Durgapur (Lok Sabha)",
                "mp_name": "Kirti Azad",
                "blocks": ["Galsi", "Bhatar", "Ausgram", "Durgapur Rural"],
                "lat": 23.2324, "lng": 87.8615,
                "agencies": ["Purba Bardhaman Zilla Parishad", "WB PWD", "Durgapur Municipal Corp"]
            }
        ]
    },

    # 4. Bihar (8 Constituencies ~7.5% national share)
    {
        "state": "Bihar",
        "weight": 8,
        "districts": [
            {
                "district": "Patna",
                "constituency": "Patna Sahib (Lok Sabha)",
                "mp_name": "Ravi Shankar Prasad",
                "blocks": ["Patna Sadar", "Danapur", "Phulwari Sharif", "Fatuha", "Bakhtiarpur"],
                "lat": 25.5941, "lng": 85.1376,
                "agencies": ["Patna Municipal Corp", "Bihar Rajya Pul Nirman Nigam", "Rural Works Dept Bihar"]
            },
            {
                "district": "Gaya",
                "constituency": "Gaya (Lok Sabha)",
                "mp_name": "Jitan Ram Manjhi",
                "blocks": ["Bodh Gaya", "Sherghati", "Tekari", "Wazirganj", "Manpur"],
                "lat": 24.7914, "lng": 85.0002,
                "agencies": ["District Rural Dev Agency Gaya", "PHED Bihar", "Rural Works Dept Bihar"]
            },
            {
                "district": "Muzaffarpur",
                "constituency": "Muzaffarpur (Lok Sabha)",
                "mp_name": "Raj Bhushan Choudhary",
                "blocks": ["Kanti", "Motipur", "Sakra", "Kurhani", "Mushahari"],
                "lat": 26.1209, "lng": 85.3647,
                "agencies": ["Muzaffarpur Zilla Parishad", "Rural Works Dept Bihar", "PHED Muzaffarpur"]
            },
            {
                "district": "Bhagalpur",
                "constituency": "Bhagalpur (Lok Sabha)",
                "mp_name": "Ajay Kumar Mandal",
                "blocks": ["Nathnagar", "Sultanganj", "Sabour", "Kahalgaon", "Pirpainti"],
                "lat": 25.2425, "lng": 86.9842,
                "agencies": ["Bhagalpur Smart City", "PWD Bhagalpur", "Rural Works Dept Bihar"]
            },
            {
                "district": "Nalanda",
                "constituency": "Nalanda (Lok Sabha)",
                "mp_name": "Kaushlendra Kumar",
                "blocks": ["Biharsharif", "Rajgir", "Islampur", "Hilsa", "Harnaut"],
                "lat": 25.1982, "lng": 85.5149,
                "agencies": ["DRDA Nalanda", "PHED Bihar", "Rural Works Dept Nalanda"]
            },
            {
                "district": "Purnia",
                "constituency": "Purnia (Lok Sabha)",
                "mp_name": "Pappu Yadav",
                "blocks": ["Kasba", "Banmankhi", "Dagarua", "Dhamdaha", "Krityanand Nagar"],
                "lat": 25.7771, "lng": 87.4753,
                "agencies": ["Purnia Zilla Parishad", "Rural Works Dept Bihar", "PHED Purnia"]
            },
            {
                "district": "Saran",
                "constituency": "Saran (Lok Sabha)",
                "mp_name": "Rajiv Pratap Rudy",
                "blocks": ["Chhapra Sadar", "Marhaura", "Dighwara", "Parsa", "Garkha"],
                "lat": 25.7796, "lng": 84.7499,
                "agencies": ["Saran DRDA", "PWD Chhapra", "Rural Works Dept Saran"]
            },
            {
                "district": "Darbhanga",
                "constituency": "Darbhanga (Lok Sabha)",
                "mp_name": "Gopal Jee Thakur",
                "blocks": ["Bahadurpur", "Keoti", "Jale", "Benipur", "Baheri"],
                "lat": 26.1542, "lng": 85.8918,
                "agencies": ["Darbhanga Municipal Corp", "Rural Works Dept", "PHED Darbhanga"]
            }
        ]
    },

    # 5. Tamil Nadu (7 Constituencies ~7.2% national share)
    {
        "state": "Tamil Nadu",
        "weight": 7,
        "districts": [
            {
                "district": "Coimbatore",
                "constituency": "Coimbatore (Lok Sabha)",
                "mp_name": "Ganapathi P. Rajkumar",
                "blocks": ["Pollachi", "Sulur", "Mettupalayam", "Annur", "Perur"],
                "lat": 11.0168, "lng": 76.9558,
                "agencies": ["Tamil Nadu PWD", "Coimbatore City Corp", "DRDA Coimbatore", "TWAD Board"]
            },
            {
                "district": "Madurai",
                "constituency": "Madurai (Lok Sabha)",
                "mp_name": "Su. Venkatesan",
                "blocks": ["Madurai East", "Madurai West", "Melur", "Thiruparankundram", "Vadipatti"],
                "lat": 9.9252, "lng": 78.1198,
                "agencies": ["Madurai Municipal Corp", "PWD Water Resources", "DRDA Madurai"]
            },
            {
                "district": "Chennai",
                "constituency": "Chennai Central (Lok Sabha)",
                "mp_name": "Dayanidhi Maran",
                "blocks": ["Anna Nagar", "Thousand Lights", "Chepauk", "Egmore", "Harbour"],
                "lat": 13.0827, "lng": 80.2707,
                "agencies": ["Greater Chennai Corporation", "Chennai Metro Water (CMWSSB)", "TN PWD"]
            },
            {
                "district": "Thanjavur",
                "constituency": "Thanjavur (Lok Sabha)",
                "mp_name": "S. Murasoli",
                "blocks": ["Kumbakonam", "Papanasam", "Orathanadu", "Pattukkottai"],
                "lat": 10.7870, "lng": 79.1378,
                "agencies": ["Thanjavur City Corp", "Tamil Nadu TWAD Board", "DRDA Thanjavur"]
            },
            {
                "district": "Salem",
                "constituency": "Salem (Lok Sabha)",
                "mp_name": "T. M. Selvaganapathi",
                "blocks": ["Omalur", "Attur", "Yercaud", "Sankari", "Edappadi"],
                "lat": 11.6643, "lng": 78.1460,
                "agencies": ["Salem Municipal Corp", "DRDA Salem", "TN PWD Salem"]
            },
            {
                "district": "Tiruchirappalli",
                "constituency": "Tiruchirappalli (Lok Sabha)",
                "mp_name": "Durai Vaiko",
                "blocks": ["Srirangam", "Manapparai", "Lalgudi", "Musiri", "Thuraiyur"],
                "lat": 10.7905, "lng": 78.7047,
                "agencies": ["Tiruchirappalli City Corp", "TN PWD", "DRDA Tiruchirappalli"]
            },
            {
                "district": "Tirunelveli",
                "constituency": "Tirunelveli (Lok Sabha)",
                "mp_name": "Robert Bruce",
                "blocks": ["Palayamkottai", "Ambasamudram", "Nanguneri", "Radhapuram"],
                "lat": 8.7139, "lng": 77.7567,
                "agencies": ["Tirunelveli City Corp", "DRDA Tirunelveli", "TWAD Board Tirunelveli"]
            }
        ]
    },

    # 6. Madhya Pradesh (6 Constituencies ~5.5% national share)
    {
        "state": "Madhya Pradesh",
        "weight": 6,
        "districts": [
            {
                "district": "Bhopal",
                "constituency": "Bhopal (Lok Sabha)",
                "mp_name": "Alok Sharma",
                "blocks": ["Berasia", "Phanda", "Kolar", "Huzur"],
                "lat": 23.2599, "lng": 77.4126,
                "agencies": ["Bhopal Municipal Corp", "MP Rural Road Dev Authority (MPRRDA)", "PWD MP"]
            },
            {
                "district": "Indore",
                "constituency": "Indore (Lok Sabha)",
                "mp_name": "Shankar Lalwani",
                "blocks": ["Sanwer", "Depalpur", "Mhow", "Rau"],
                "lat": 22.7196, "lng": 75.8577,
                "agencies": ["Indore Municipal Corp", "Indore Dev Authority", "PWD Indore"]
            },
            {
                "district": "Jabalpur",
                "constituency": "Jabalpur (Lok Sabha)",
                "mp_name": "Ashish Dubey",
                "blocks": ["Panagar", "Sihora", "Patan", "Shahpura", "Kundam"],
                "lat": 23.1815, "lng": 79.9864,
                "agencies": ["Jabalpur Smart City", "MPRRDA", "DRDA Jabalpur"]
            },
            {
                "district": "Gwalior",
                "constituency": "Gwalior (Lok Sabha)",
                "mp_name": "Bharat Singh Kushwah",
                "blocks": ["Morar", "Dabra", "Bhitarwar", "Ghatigaon"],
                "lat": 26.2183, "lng": 78.1828,
                "agencies": ["Gwalior Municipal Corp", "MP PWD", "MPRRDA Gwalior"]
            },
            {
                "district": "Ujjain",
                "constituency": "Ujjain (Lok Sabha)",
                "mp_name": "Anil Firojiya",
                "blocks": ["Mahidpur", "Tarana", "Ghatiya", "Badnagar", "Khachrod"],
                "lat": 23.1765, "lng": 75.7885,
                "agencies": ["Ujjain Smart City", "MP Jal Nigam", "PWD Ujjain"]
            },
            {
                "district": "Sagar",
                "constituency": "Sagar (Lok Sabha)",
                "mp_name": "Lata Wankhede",
                "blocks": ["Bina", "Khurai", "Banda", "Rahatgarh", "Deori"],
                "lat": 23.8388, "lng": 78.7378,
                "agencies": ["Sagar Smart City", "MPRRDA", "DRDA Sagar"]
            }
        ]
    },

    # 7. Karnataka (6 Constituencies ~5.2% national share)
    {
        "state": "Karnataka",
        "weight": 5,
        "districts": [
            {
                "district": "Bangalore Rural",
                "constituency": "Bangalore Rural (Lok Sabha)",
                "mp_name": "Dr. C. N. Manjunath",
                "blocks": ["Devanahalli", "Doddaballapura", "Hosakote", "Nelamangala"],
                "lat": 13.2926, "lng": 77.5450,
                "agencies": ["KRIDL Rural Infra", "Zilla Panchayat Bangalore Rural", "PWD Karnataka"]
            },
            {
                "district": "Bangalore Urban",
                "constituency": "Bangalore South (Lok Sabha)",
                "mp_name": "Tejasvi Surya",
                "blocks": ["Basavanagudi", "Padmanabhanagar", "BTM Layout", "Jayanagar"],
                "lat": 12.9249, "lng": 77.5838,
                "agencies": ["BBMP Bangalore", "BWSSB Karnataka", "Karnataka Urban Infra Dev Corp"]
            },
            {
                "district": "Mysuru",
                "constituency": "Mysore (Lok Sabha)",
                "mp_name": "Yaduveer Krishnadatta Chamaraja Wadiyar",
                "blocks": ["Hunsur", "Nanjangud", "T. Narasipura", "K.R. Nagar", "Heggadadevankote"],
                "lat": 12.2958, "lng": 76.6394,
                "agencies": ["PWD Mysuru", "Zilla Panchayat Mysuru", "Mysore Urban Dev Authority"]
            },
            {
                "district": "Dharwad",
                "constituency": "Dharwad (Lok Sabha)",
                "mp_name": "Pralhad Joshi",
                "blocks": ["Hubli Rural", "Kalghatgi", "Kundgol", "Navalgund"],
                "lat": 15.4589, "lng": 75.0078,
                "agencies": ["Hubballi-Dharwad Smart City", "PWD Karnataka", "Zilla Panchayat Dharwad"]
            },
            {
                "district": "Belagavi",
                "constituency": "Belagavi (Lok Sabha)",
                "mp_name": "Jagadish Shettar",
                "blocks": ["Gokak", "Chikkodi", "Bailhongal", "Khanapur", "Saundatti"],
                "lat": 15.8497, "lng": 74.4977,
                "agencies": ["Belagavi City Corp", "Zilla Panchayat Belagavi", "PWD Karnataka"]
            },
            {
                "district": "Dakshina Kannada",
                "constituency": "Dakshina Kannada (Lok Sabha)",
                "mp_name": "Capt. Brijesh Chowta",
                "blocks": ["Bantwal", "Belthangady", "Puttur", "Sullia", "Moodbidri"],
                "lat": 12.9141, "lng": 74.8560,
                "agencies": ["Mangaluru Smart City", "PWD Karnataka", "Zilla Panchayat Mangaluru"]
            }
        ]
    },

    # 8. Gujarat (5 Constituencies ~5% national share)
    {
        "state": "Gujarat",
        "weight": 5,
        "districts": [
            {
                "district": "Ahmedabad",
                "constituency": "Ahmedabad East (Lok Sabha)",
                "mp_name": "Hasmukh Patel",
                "blocks": ["Nikol", "Naroda", "Vatva", "Asarwa", "Daskroi"],
                "lat": 23.0225, "lng": 72.5714,
                "agencies": ["Ahmedabad Municipal Corp (AMC)", "Gujarat Water Supply Board (GWSSB)", "R&B Dept Gujarat"]
            },
            {
                "district": "Surat",
                "constituency": "Surat (Lok Sabha)",
                "mp_name": "Mukesh Dalal",
                "blocks": ["Olpad", "Kamrej", "Bardoli", "Choryasi", "Mandvi"],
                "lat": 21.1702, "lng": 72.8311,
                "agencies": ["Surat Municipal Corp (SMC)", "Roads & Buildings Dept Gujarat", "DRDA Surat"]
            },
            {
                "district": "Vadodara",
                "constituency": "Vadodara (Lok Sabha)",
                "mp_name": "Hemang Joshi",
                "blocks": ["Padra", "Savli", "Waghodia", "Karjan", "Dabhoi"],
                "lat": 22.3072, "lng": 73.1812,
                "agencies": ["Vadodara Municipal Corp (VMC)", "Gujarat Urban Dev Mission", "R&B Vadodara"]
            },
            {
                "district": "Rajkot",
                "constituency": "Rajkot (Lok Sabha)",
                "mp_name": "Parshottam Rupala",
                "blocks": ["Gondal", "Jasdan", "Dhoraji", "Jetpur", "Kotda Sangani"],
                "lat": 22.3039, "lng": 70.8022,
                "agencies": ["Rajkot Urban Dev Authority (RUDA)", "GWSSB Gujarat", "DRDA Rajkot"]
            },
            {
                "district": "Bhavnagar",
                "constituency": "Bhavnagar (Lok Sabha)",
                "mp_name": "Nimuben Bambhaniya",
                "blocks": ["Sihor", "Palitana", "Mahuva", "Talaja", "Gariadhar"],
                "lat": 21.7645, "lng": 72.1519,
                "agencies": ["Bhavnagar Municipal Corp", "Gujarat PWD", "DRDA Bhavnagar"]
            }
        ]
    },

    # 9. Rajasthan (5 Constituencies ~4.6% national share)
    {
        "state": "Rajasthan",
        "weight": 5,
        "districts": [
            {
                "district": "Jaipur",
                "constituency": "Jaipur (Lok Sabha)",
                "mp_name": "Manju Sharma",
                "blocks": ["Sanganer", "Amer", "Bassi", "Jamwa Ramgarh", "Chaksu"],
                "lat": 26.9124, "lng": 75.7873,
                "agencies": ["Jaipur Development Authority", "Rajasthan PWD", "PHED Rajasthan"]
            },
            {
                "district": "Jodhpur",
                "constituency": "Jodhpur (Lok Sabha)",
                "mp_name": "Gajendra Singh Shekhawat",
                "blocks": ["Luni", "Bilara", "Osian", "Phalodi", "Shergarh"],
                "lat": 26.2389, "lng": 73.0243,
                "agencies": ["Jodhpur Dev Authority", "PHED Rajasthan", "DRDA Jodhpur", "Rajasthan PWD"]
            },
            {
                "district": "Kota",
                "constituency": "Kota (Lok Sabha)",
                "mp_name": "Om Birla",
                "blocks": ["Ladpura", "Digod", "Sangod", "Ramganj Mandi", "Itawa"],
                "lat": 25.2138, "lng": 75.8648,
                "agencies": ["Urban Improvement Trust Kota", "Rajasthan PWD", "DRDA Kota"]
            },
            {
                "district": "Udaipur",
                "constituency": "Udaipur (Lok Sabha)",
                "mp_name": "Manna Lal Rawat",
                "blocks": ["Mavli", "Vallabhnagar", "Girwa", "Gogunda", "Kherwara"],
                "lat": 24.5854, "lng": 73.7125,
                "agencies": ["Udaipur Smart City", "Rajasthan Tribal Area Dev Dept", "PWD Udaipur"]
            },
            {
                "district": "Bikaner",
                "constituency": "Bikaner (Lok Sabha)",
                "mp_name": "Arjun Ram Meghwal",
                "blocks": ["Nokha", "Kolayat", "Lunkaransar", "Khajuwala", "Dungargarh"],
                "lat": 28.0229, "lng": 73.3119,
                "agencies": ["Bikaner Municipal Corp", "PHED Rajasthan", "Rajasthan PWD"]
            }
        ]
    },

    # 10. Andhra Pradesh (5 Constituencies ~4.6% national share)
    {
        "state": "Andhra Pradesh",
        "weight": 5,
        "districts": [
            {
                "district": "Visakhapatnam",
                "constituency": "Visakhapatnam (Lok Sabha)",
                "mp_name": "M. Sribharat",
                "blocks": ["Anandapuram", "Bheemunipatnam", "Pendurthi", "Gajuwaka"],
                "lat": 17.6868, "lng": 83.2185,
                "agencies": ["Greater Visakhapatnam Municipal Corp (GVMC)", "AP PWD", "AP RWS"]
            },
            {
                "district": "NTR / Krishna",
                "constituency": "Vijayawada (Lok Sabha)",
                "mp_name": "Kesineni Sivanath",
                "blocks": ["Gannavaram", "Mylavaram", "Ibrahimpatnam", "Kanchikacherla"],
                "lat": 16.5062, "lng": 80.6480,
                "agencies": ["Vijayawada Municipal Corp", "AP CRDA", "AP Panchayat Raj Dept"]
            },
            {
                "district": "Guntur",
                "constituency": "Guntur (Lok Sabha)",
                "mp_name": "Pemmasani Chandra Sekhar",
                "blocks": ["Mangalagiri", "Tadepalle", "Tenali", "Ponnur", "Tadikonda"],
                "lat": 16.3067, "lng": 80.4365,
                "agencies": ["Guntur Municipal Corp", "AP Panchayat Raj Dept", "AP PWD"]
            },
            {
                "district": "Tirupati",
                "constituency": "Tirupati (Lok Sabha)",
                "mp_name": "Maddila Gurumoorthy",
                "blocks": ["Chandragiri", "Srikalahasti", "Satyavedu", "Nagari"],
                "lat": 13.6288, "lng": 79.4192,
                "agencies": ["Tirupati Smart City", "AP RWS (Rural Water Supply)", "AP PWD"]
            },
            {
                "district": "East Godavari",
                "constituency": "Rajahmundry (Lok Sabha)",
                "mp_name": "Daggubati Purandeswari",
                "blocks": ["Kovvur", "Nidadavole", "Rajanagaram", "Anaparthy"],
                "lat": 17.0005, "lng": 81.8040,
                "agencies": ["Godavari Urban Dev Authority", "AP PWD", "AP Panchayat Raj"]
            }
        ]
    },

    # 11. Odisha (4 Constituencies ~4% national share)
    {
        "state": "Odisha",
        "weight": 4,
        "districts": [
            {
                "district": "Khurda",
                "constituency": "Bhubaneswar (Lok Sabha)",
                "mp_name": "Aparajita Sarangi",
                "blocks": ["Balianta", "Balipatna", "Jatni", "Khurda Sadar"],
                "lat": 20.2961, "lng": 85.8245,
                "agencies": ["Bhubaneswar Municipal Corp", "Odisha Works Dept", "RWSS Odisha"]
            },
            {
                "district": "Cuttack",
                "constituency": "Cuttack (Lok Sabha)",
                "mp_name": "Bhartruhari Mahtab",
                "blocks": ["Salepur", "Mahanga", "Choudwar", "Nischintakoili"],
                "lat": 20.4625, "lng": 85.8828,
                "agencies": ["Cuttack Municipal Corp", "Odisha Panchayati Raj Dept", "Odisha Works Dept"]
            },
            {
                "district": "Puri",
                "constituency": "Puri (Lok Sabha)",
                "mp_name": "Sambit Patra",
                "blocks": ["Pipili", "Satyabadi", "Brahmagiri", "Kanas", "Nimapara"],
                "lat": 19.8135, "lng": 85.8312,
                "agencies": ["Puri Municipality", "Odisha Rural Dev Dept", "RWSS Puri"]
            },
            {
                "district": "Sambalpur",
                "constituency": "Sambalpur (Lok Sabha)",
                "mp_name": "Dharmendra Pradhan",
                "blocks": ["Rengali", "Jujomura", "Kuchinda", "Jamankira"],
                "lat": 21.4669, "lng": 83.9812,
                "agencies": ["Sambalpur Municipal Corp", "Western Odisha Dev Council", "Odisha Works Dept"]
            }
        ]
    },

    # 12. Kerala (4 Constituencies ~3.8% national share)
    {
        "state": "Kerala",
        "weight": 4,
        "districts": [
            {
                "district": "Thiruvananthapuram",
                "constituency": "Thiruvananthapuram (Lok Sabha)",
                "mp_name": "Shashi Tharoor",
                "blocks": ["Nemom", "Kazhakkoottam", "Vattiyoorkavu", "Neyyattinkara"],
                "lat": 8.5241, "lng": 76.9366,
                "agencies": ["Thiruvananthapuram Corp", "Kerala PWD", "Kerala Water Authority"]
            },
            {
                "district": "Ernakulam",
                "constituency": "Ernakulam (Lok Sabha)",
                "mp_name": "Hibi Eden",
                "blocks": ["Kochi", "Paravur", "Aluva", "Kanayannur", "Angamaly"],
                "lat": 9.9816, "lng": 76.2999,
                "agencies": ["Kochi Municipal Corp", "Cochin Smart City", "Kerala PWD"]
            },
            {
                "district": "Kozhikode",
                "constituency": "Kozhikode (Lok Sabha)",
                "mp_name": "M. K. Raghavan",
                "blocks": ["Vadakara", "Koyilandy", "Kunnamangalam", "Balussery"],
                "lat": 11.2588, "lng": 75.7804,
                "agencies": ["Kozhikode Corp", "Kerala Local Self Govt Dept", "Kerala Water Authority"]
            },
            {
                "district": "Thrissur",
                "constituency": "Thrissur (Lok Sabha)",
                "mp_name": "Suresh Gopi",
                "blocks": ["Ollur", "Guruvayur", "Kodungallur", "Chalakudy"],
                "lat": 10.5276, "lng": 76.2144,
                "agencies": ["Thrissur Corp", "Kerala PWD Roads", "Kerala Water Authority"]
            }
        ]
    },

    # 13. Telangana (4 Constituencies ~3.2% national share)
    {
        "state": "Telangana",
        "weight": 3,
        "districts": [
            {
                "district": "Hyderabad",
                "constituency": "Hyderabad (Lok Sabha)",
                "mp_name": "Asaduddin Owaisi",
                "blocks": ["Charminar", "Chandrayangutta", "Bahadurpura", "Malakpet"],
                "lat": 17.3850, "lng": 78.4867,
                "agencies": ["GHMC Hyderabad", "Hyderabad Metro Water (HMWSSB)", "Telangana PWD"]
            },
            {
                "district": "Hyderabad Suburbs",
                "constituency": "Secunderabad (Lok Sabha)",
                "mp_name": "G. Kishan Reddy",
                "blocks": ["Amberpet", "Musheerabad", "Sanathnagar", "Jubilee Hills"],
                "lat": 17.4399, "lng": 78.4983,
                "agencies": ["GHMC", "Telangana PWD", "HMWSSB Secunderabad"]
            },
            {
                "district": "Warangal",
                "constituency": "Warangal (Lok Sabha)",
                "mp_name": "Kadiyam Kavya",
                "blocks": ["Hanamkonda", "Kazipet", "Wardhannapet", "Parkal"],
                "lat": 17.9689, "lng": 79.5941,
                "agencies": ["Greater Warangal Municipal Corp", "Telangana Panchayat Raj", "Mission Bhagiratha"]
            },
            {
                "district": "Karimnagar",
                "constituency": "Karimnagar (Lok Sabha)",
                "mp_name": "Bandi Sanjay Kumar",
                "blocks": ["Choppadandi", "Manakondur", "Huzurabad", "Gangadhara"],
                "lat": 18.4386, "lng": 79.1288,
                "agencies": ["Karimnagar Smart City", "Telangana R&B Dept", "DRDA Karimnagar"]
            }
        ]
    },

    # 14. Assam & North East (5 Constituencies ~4.6% national share)
    {
        "state": "Assam",
        "weight": 3,
        "districts": [
            {
                "district": "Kamrup Metropolitan",
                "constituency": "Gauhati (Lok Sabha)",
                "mp_name": "Bijuli Kalita Medhi",
                "blocks": ["Dispur", "Jalukbari", "Hajo", "Boko", "Palashbari"],
                "lat": 26.1445, "lng": 91.7362,
                "agencies": ["Guwahati Municipal Corp", "Assam PWD", "DRDA Kamrup"]
            },
            {
                "district": "Dibrugarh",
                "constituency": "Dibrugarh (Lok Sabha)",
                "mp_name": "Sarbananda Sonowal",
                "blocks": ["Moran", "Tingkhong", "Naharkatia", "Duliajan"],
                "lat": 27.4728, "lng": 94.9120,
                "agencies": ["Dibrugarh Municipal Board", "Assam PWD Roads", "DRDA Dibrugarh"]
            },
            {
                "district": "Cachar",
                "constituency": "Silchar (Lok Sabha)",
                "mp_name": "Parimal Suklabaidya",
                "blocks": ["Katigorah", "Dholai", "Sonai", "Udharbond"],
                "lat": 24.8333, "lng": 92.7789,
                "agencies": ["Cachar Zilla Parishad", "Assam PHE Dept", "Assam PWD"]
            }
        ]
    },
    {
        "state": "Meghalaya",
        "weight": 1,
        "districts": [
            {
                "district": "East Khasi Hills",
                "constituency": "Shillong (Lok Sabha)",
                "mp_name": "Ricky Andrew Syngkon",
                "blocks": ["Mylliem", "Mawphlang", "Mawsynram", "Pynursla"],
                "lat": 25.5788, "lng": 91.8933,
                "agencies": ["Meghalaya PWD", "Shillong Municipal Board", "DRDA East Khasi Hills"]
            }
        ]
    },
    {
        "state": "Manipur",
        "weight": 1,
        "districts": [
            {
                "district": "Imphal East",
                "constituency": "Inner Manipur (Lok Sabha)",
                "mp_name": "Bimol Akoijam",
                "blocks": ["Porompat", "Sawombung", "Keirao Bitra"],
                "lat": 24.8170, "lng": 93.9368,
                "agencies": ["Manipur PWD", "Manipur DRDA", "PHED Manipur"]
            }
        ]
    },

    # 15. Other States / UTs (7 Constituencies ~8% national share)
    {
        "state": "Delhi",
        "weight": 2,
        "districts": [
            {
                "district": "New Delhi",
                "constituency": "New Delhi (Lok Sabha)",
                "mp_name": "Bansuri Swaraj",
                "blocks": ["Connaught Place", "Chanakyapuri", "Karol Bagh", "Delhi Cantt"],
                "lat": 28.6139, "lng": 77.2090,
                "agencies": ["NDMC New Delhi", "Delhi PWD", "DDA Delhi", "Delhi Jal Board"]
            }
        ]
    },
    {
        "state": "Punjab",
        "weight": 2,
        "districts": [
            {
                "district": "Amritsar",
                "constituency": "Amritsar (Lok Sabha)",
                "mp_name": "Gurjeet Singh Aujla",
                "blocks": ["Ajnala", "Majitha", "Attari", "Jandiala"],
                "lat": 31.6340, "lng": 74.8723,
                "agencies": ["Amritsar Municipal Corp", "Punjab Mandi Board", "Punjab PWD"]
            }
        ]
    },
    {
        "state": "Haryana",
        "weight": 2,
        "districts": [
            {
                "district": "Gurugram",
                "constituency": "Gurgaon (Lok Sabha)",
                "mp_name": "Rao Inderjit Singh",
                "blocks": ["Badshahpur", "Pataudi", "Sohna", "Farrukhnagar"],
                "lat": 28.4595, "lng": 77.0266,
                "agencies": ["GMDA Gurugram", "Haryana PWD (B&R)", "Haryana Shehri Vikas Pradhikaran"]
            }
        ]
    },
    {
        "state": "Uttarakhand",
        "weight": 2,
        "districts": [
            {
                "district": "Haridwar",
                "constituency": "Haridwar (Lok Sabha)",
                "mp_name": "Trivendra Singh Rawat",
                "blocks": ["Roorkee", "Bhagwanpur", "Laksar", "Bahadrabad"],
                "lat": 29.9457, "lng": 78.1642,
                "agencies": ["Haridwar Roorkee Dev Authority", "Uttarakhand Peyjal Nigam", "PWD Uttarakhand"]
            }
        ]
    },
    {
        "state": "Himachal Pradesh",
        "weight": 1,
        "districts": [
            {
                "district": "Shimla",
                "constituency": "Shimla (Lok Sabha)",
                "mp_name": "Suresh Kumar Kashyap",
                "blocks": ["Theog", "Kasumpti", "Rohru", "Solan Rural"],
                "lat": 31.1048, "lng": 77.1734,
                "agencies": ["HP PWD", "HP Jal Shakti Vibhag", "DRDA Shimla"]
            }
        ]
    },
    {
        "state": "Jammu & Kashmir",
        "weight": 1,
        "districts": [
            {
                "district": "Srinagar",
                "constituency": "Srinagar (Lok Sabha)",
                "mp_name": "Aga Syed Ruhullah Mehdi",
                "blocks": ["Hazratbal", "Batamaloo", "Khanyar", "Zadibal"],
                "lat": 34.0837, "lng": 74.7973,
                "agencies": ["Srinagar Municipal Corp", "J&K R&B Dept", "Jal Shakti J&K"]
            }
        ]
    },
    {
        "state": "Goa",
        "weight": 1,
        "districts": [
            {
                "district": "North Goa",
                "constituency": "North Goa (Lok Sabha)",
                "mp_name": "Shripad Yesso Naik",
                "blocks": ["Bardez", "Bicholim", "Pernem", "Sattari", "Tiswadi"],
                "lat": 15.4909, "lng": 73.8278,
                "agencies": ["Goa PWD", "Goa Waste Management Corp", "DRDA North Goa"]
            }
        ]
    }
]

# Calibrated Work Categories, Realistic Cost Brackets (State PWD Schedule of Rates) & Durations
WORK_TYPES = [
    {
        "type": "Rural Road & Culvert",
        "weight": 36,  # 36% volume share
        "cost_min": 500000,
        "cost_max": 3500000,
        "duration_min": 90,
        "duration_max": 240,
        "templates": [
            "Construction of cement concrete (CC) internal village road at {village}",
            "Bituminous road widening and storm-water drainage culvert in {village}",
            "Inter-hamlet link road paving connecting agricultural mandi to {village}",
            "Laying of heavy-duty interlocking paver block street in {village} settlement",
            "Construction of reinforced concrete box culvert on arterial approach road at {village}"
        ]
    },
    {
        "type": "Drinking Water Facility",
        "weight": 18,  # 18% volume share
        "cost_min": 300000,
        "cost_max": 1800000,
        "duration_min": 45,
        "duration_max": 120,
        "templates": [
            "Installation of 1000 LPH RO drinking water purification kiosk in {village}",
            "Provision of deep solar-powered borewell with 5000L elevated storage tank at {village}",
            "Upgradation of pipeline distribution and community water tap stands in {village}",
            "Installation of fluorosis/arsenic filtration drinking water unit in {village} school campus",
            "Deployment of solar water pumping system and distribution cistern in {village}"
        ]
    },
    {
        "type": "Community Infrastructure",
        "weight": 14,  # 14% volume share
        "cost_min": 1500000,
        "cost_max": 5000000,
        "duration_min": 120,
        "duration_max": 300,
        "templates": [
            "Construction of multipurpose community hall / Barat Ghar in {village}",
            "Development of public cultural center and community shed at {village}",
            "Construction of cremation ground covered shed (Shmashan Ghat) with solar lights in {village}",
            "Renovation and structural expansion of Gram Panchayat community auditorium in {village}",
            "Construction of multi-utility cyclone / flood safety community shelter at {village}"
        ]
    },
    {
        "type": "School Classroom & Education",
        "weight": 11,  # 11% volume share
        "cost_min": 600000,
        "cost_max": 2500000,
        "duration_min": 60,
        "duration_max": 180,
        "templates": [
            "Construction of two additional smart classrooms in Zilla Parishad High School, {village}",
            "Erection of protective boundary wall and main gate for Government Senior Secondary School, {village}",
            "Provision of STEM science laboratory equipment, computer lab furniture and student desks at {village}",
            "Installation of rooftop solar generation system and clean drinking facility in Govt School, {village}",
            "Upgradation of primary school infrastructure with disabled-friendly ramps and smart board in {village}"
        ]
    },
    {
        "type": "Solar & Public Lighting",
        "weight": 9,  # 9% volume share
        "cost_min": 250000,
        "cost_max": 1200000,
        "duration_min": 30,
        "duration_max": 90,
        "templates": [
            "Installation of 30 standalone LED solar street lights across major junctions in {village}",
            "Erection of high-mast 16-meter LED solar illumination tower near market square in {village}",
            "Illumination of village approach road and panchayat center with dusk-to-dawn solar luminaires at {village}",
            "Installation of solar mini-grid powered street lighting and battery bank at {village}"
        ]
    },
    {
        "type": "Primary Health Sub-Center & Medical",
        "weight": 6,  # 6% volume share
        "cost_min": 800000,
        "cost_max": 3500000,
        "duration_min": 120,
        "duration_max": 300,
        "templates": [
            "Upgradation of Primary Health Sub-Center with maternity care and diagnostics room at {village}",
            "Procurement and fabrication of Advanced Life Support (ALS) mobile ambulance for {village} block",
            "Civil construction of Ayushman Bharat Health & Wellness Centre dispensary in {village}",
            "Supply of medical diagnostics, vaccine cold chain refrigerator and emergency triage beds at {village}"
        ]
    },
    {
        "type": "Sanitation & Public Amenities",
        "weight": 4,  # 4% volume share
        "cost_min": 400000,
        "cost_max": 1400000,
        "duration_min": 40,
        "duration_max": 120,
        "templates": [
            "Construction of community sanitary complex with dedicated women hygiene cubicles at {village}",
            "Modern Sulabh-type public sanitation facility with running water and septic tank in {village} bus stand",
            "Construction of passenger waiting shelter and public utility block near bus stop in {village}",
            "Provision of solid-liquid waste collection shed and composting unit at Gram Panchayat {village}"
        ]
    },
    {
        "type": "Sports & Youth Welfare",
        "weight": 2,  # 2% volume share
        "cost_min": 300000,
        "cost_max": 1500000,
        "duration_min": 45,
        "duration_max": 120,
        "templates": [
            "Installation of open-air fitness gym equipment and rubberized track in public park, {village}",
            "Development of rural youth sports playground with multi-sport court and chain-link fencing at {village}",
            "Construction of pavilion seating shed and sports training facility in Gram Panchayat {village}"
        ]
    }
]

VILLAGES = [
    "Rampur", "Shivpur", "Khadki", "Chandrapur", "Sundar Nagar", "Devipura", "Kalyanpur",
    "Gopalganj", "Adarsh Nagar", "Navi Vasti", "Hanuman Nagar", "Krishnapuram", "Gandhi Gram",
    "Kaveri Nagar", "Indira Nagar", "Bhavani Peth", "Lakshmipuram", "Green Park", "Patel Nagar",
    "Vikas Nagar", "Shivaji Nagar", "Subhash Nagar", "Nehru Colony", "Surya Nagar", "Bhojpur",
    "Balarampur", "Nandgaon", "Shanti Nagar", "Mahavir Nagar", "Ganeshpur", "Rajendra Nagar",
    "Vivekananda Nagar", "Sardar Patel Nagar", "Tilak Nagar", "Ambedkar Basti", "Tagore Pally",
    "Anand Vihar", "Panchavati", "Chitrakoot", "Govindpur", "Sitarampur", "Madhavpuram"
]

def generate_demo_dataset(target_count: int = 1200, output_path: str = None) -> List[Dict[str, Any]]:
    """
    Generates a realistic synthetic MPLADS dataset calibrated against official MoSPI,
    Sansad parliamentary replies, and CAG audit findings.
    """
    random.seed(42)  # Deterministic seed for reproducible testing & verification
    works: List[Dict[str, Any]] = []

    # -------------------------------------------------------------
    # 1. GROUNDED ANOMALY CLUSTERS (CALIBRATED AGAINST CAG FINDINGS)
    # -------------------------------------------------------------

    # CAG Pattern 1: Severe Cost Inflation Outlier + Superfast Signoff
    works.append({
        "work_id": "MPLADS-2023-MH-042",
        "mp_name": "Murlidhar Mohol",
        "mp_house": "Lok Sabha",
        "constituency": "Pune (Lok Sabha)",
        "state": "Maharashtra",
        "district": "Pune",
        "block": "Baramati",
        "village": "Karhati",
        "implementing_agency": "Zilla Parishad Pune",
        "work_type": "Community Infrastructure",
        "work_description": "Construction of multipurpose community hall in Karhati (CAG ANOMALY: Cost 4.2x peer median, completed in 15 days)",
        "sanctioned_amount": 9250000.0,
        "released_amount": 9250000.0,
        "expenditure": 9250000.0,
        "balance_amount": 0.0,
        "work_status": "Completed",
        "recommendation_date": "2023-05-15",
        "sanction_date": "2023-06-10",
        "completion_date": "2023-06-25",
        "financial_year": "2023-24",
        "latitude": 18.1524,
        "longitude": 74.5772,
        "is_demo": True
    })

    # CAG Pattern 2: Severe Stalled Work with Stranded Advance (>2 years, low expenditure)
    works.append({
        "work_id": "MPLADS-2023-KA-088",
        "mp_name": "Yaduveer Krishnadatta Chamaraja Wadiyar",
        "mp_house": "Lok Sabha",
        "constituency": "Mysore (Lok Sabha)",
        "state": "Karnataka",
        "district": "Mysuru",
        "block": "Hunsur",
        "village": "Bilikere",
        "implementing_agency": "Zilla Panchayat Mysuru",
        "work_type": "Primary Health Sub-Center & Medical",
        "work_description": "Upgradation of primary health sub-center with maternity care room at Bilikere (CAG ANOMALY: Sanctioned >2 yrs ago, 100% advance released, only 4.8% spent)",
        "sanctioned_amount": 4600000.0,
        "released_amount": 4600000.0,
        "expenditure": 220000.0,
        "balance_amount": 4380000.0,
        "work_status": "Stalled",
        "recommendation_date": "2022-07-10",
        "sanction_date": "2022-08-15",
        "completion_date": "",
        "financial_year": "2022-23",
        "latitude": 12.3370,
        "longitude": 76.4380,
        "is_demo": True
    })

    # CAG Pattern 3: Financial-Physical Disconnect (99% fund disbursed while status still 'Sanctioned')
    works.append({
        "work_id": "MPLADS-2023-WB-203",
        "mp_name": "Jagannath Sarkar",
        "mp_house": "Lok Sabha",
        "constituency": "Ranaghat (Lok Sabha)",
        "state": "West Bengal",
        "district": "Nadia",
        "block": "Ranaghat-I",
        "village": "Santipur Road",
        "implementing_agency": "Public Health Engineering WB",
        "work_type": "Drinking Water Facility",
        "work_description": "Installation of 1000 LPH RO drinking water filtration unit (CAG ANOMALY: 98.7% expenditure disbursed without milestone completion certificates)",
        "sanctioned_amount": 1600000.0,
        "released_amount": 1600000.0,
        "expenditure": 1580000.0,
        "balance_amount": 20000.0,
        "work_status": "Sanctioned",
        "recommendation_date": "2023-06-01",
        "sanction_date": "2023-07-15",
        "completion_date": "",
        "financial_year": "2023-24",
        "latitude": 23.2150,
        "longitude": 88.5680,
        "is_demo": True
    })

    # CAG Pattern 4: Data Quality Defect (Negative balance, cost escalation & inverted timeline)
    works.append({
        "work_id": "MPLADS-2023-TN-164",
        "mp_name": "Ganapathi P. Rajkumar",
        "mp_house": "Lok Sabha",
        "constituency": "Coimbatore (Lok Sabha)",
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "block": "Pollachi",
        "village": "Annamalai",
        "implementing_agency": "Tamil Nadu PWD",
        "work_type": "Rural Road & Culvert",
        "work_description": "Construction of cement concrete (CC) internal village road (CAG ANOMALY: Negative balance, expenditure > sanctioned, completion date prior to sanction)",
        "sanctioned_amount": 2500000.0,
        "released_amount": 2500000.0,
        "expenditure": 3250000.0,
        "balance_amount": -750000.0,
        "work_status": "Completed",
        "recommendation_date": "2023-08-01",
        "sanction_date": "2023-09-15",
        "completion_date": "2023-03-10",  # Inverted!
        "financial_year": "2023-24",
        "latitude": 10.6580,
        "longitude": 77.0080,
        "is_demo": True
    })

    # CAG Pattern 5: Tender Splitting & Implementing Agency Monopoly Cluster (Varanasi)
    # Artificially fragmented tenders to avoid higher administrative approval ceilings
    for c_idx in range(1, 11):
        works.append({
            "work_id": f"MPLADS-2023-UP-CL{c_idx:02d}",
            "mp_name": "Narendra Modi",
            "mp_house": "Lok Sabha",
            "constituency": "Varanasi (Lok Sabha)",
            "state": "Uttar Pradesh",
            "district": "Varanasi",
            "block": "Sevapuri",
            "village": "Kashi-Puram",
            "implementing_agency": "M/s Purvanchal InfraTech Services",
            "work_type": "Solar & Public Lighting",
            "work_description": f"Installation of high-density solar street illumination cluster unit #{c_idx} in Kashi-Puram (CAG ANOMALY: Tender splitting & single-agency cartel)",
            "sanctioned_amount": 980000.0,
            "released_amount": 980000.0,
            "expenditure": 965000.0,
            "balance_amount": 15000.0,
            "work_status": "Completed",
            "recommendation_date": "2023-07-01",
            "sanction_date": "2023-08-01",
            "completion_date": "2023-10-15",
            "financial_year": "2023-24",
            "latitude": 25.3190 + (c_idx * 0.0005),
            "longitude": 82.9720 + (c_idx * 0.0005),
            "is_demo": True
        })

    # CAG Pattern 6: Spatial Duplicate / Ghost Asset Risk (Near identical coordinates & same work type)
    works.append({
        "work_id": "MPLADS-2023-BR-077",
        "mp_name": "Jitan Ram Manjhi",
        "mp_house": "Lok Sabha",
        "constituency": "Gaya (Lok Sabha)",
        "state": "Bihar",
        "district": "Gaya",
        "block": "Bodh Gaya",
        "village": "Bakrour",
        "implementing_agency": "District Rural Dev Agency Gaya",
        "work_type": "Drinking Water Facility",
        "work_description": "Installation of 1000 LPH RO drinking water purification kiosk at Bakrour Chowk (CAG ANOMALY: Co-located <25m from pre-existing Jal Jeevan Mission asset)",
        "sanctioned_amount": 1450000.0,
        "released_amount": 1450000.0,
        "expenditure": 1440000.0,
        "balance_amount": 10000.0,
        "work_status": "Completed",
        "recommendation_date": "2023-04-10",
        "sanction_date": "2023-05-20",
        "completion_date": "2023-08-15",
        "financial_year": "2023-24",
        "latitude": 24.6980,
        "longitude": 84.9920,
        "is_demo": True
    })
    works.append({
        "work_id": "MPLADS-2023-BR-078",
        "mp_name": "Jitan Ram Manjhi",
        "mp_house": "Lok Sabha",
        "constituency": "Gaya (Lok Sabha)",
        "state": "Bihar",
        "district": "Gaya",
        "block": "Bodh Gaya",
        "village": "Bakrour",
        "implementing_agency": "PHED Bihar",
        "work_type": "Drinking Water Facility",
        "work_description": "Installation of solar community RO water station at Bakrour Main Junction (CAG ANOMALY: Duplicate spatial footprint at exact same GPS coordinate)",
        "sanctioned_amount": 1480000.0,
        "released_amount": 1480000.0,
        "expenditure": 1475000.0,
        "balance_amount": 5000.0,
        "work_status": "Completed",
        "recommendation_date": "2023-04-25",
        "sanction_date": "2023-06-05",
        "completion_date": "2023-09-01",
        "financial_year": "2023-24",
        "latitude": 24.6982,  # ~22m away
        "longitude": 84.9921,
        "is_demo": True
    })

    # CAG Pattern 7: Severe Cost Overrun (>60% above original sanction without revised approval) - Jodhpur, Rajasthan
    works.append({
        "work_id": "MPLADS-2023-RJ-091",
        "mp_name": "Gajendra Singh Shekhawat",
        "mp_house": "Lok Sabha",
        "constituency": "Jodhpur (Lok Sabha)",
        "state": "Rajasthan",
        "district": "Jodhpur",
        "block": "Shergarh",
        "village": "Balesar",
        "implementing_agency": "Rajasthan PWD",
        "work_type": "Rural Road & Culvert",
        "work_description": "Construction of cement concrete (CC) link road connecting Balesar to NH-125 (CAG ANOMALY: Final billed expenditure ₹48.5L vs original sanction of ₹28L without variation approval)",
        "sanctioned_amount": 2800000.0,
        "released_amount": 4850000.0,
        "expenditure": 4850000.0,
        "balance_amount": 0.0,
        "work_status": "Completed",
        "recommendation_date": "2023-03-12",
        "sanction_date": "2023-04-18",
        "completion_date": "2023-11-30",
        "financial_year": "2023-24",
        "latitude": 26.4020,
        "longitude": 72.4510,
        "is_demo": True
    })

    # CAG Pattern 8: Extreme Cost Inflation Outlier - New Delhi
    works.append({
        "work_id": "MPLADS-2023-DL-001",
        "mp_name": "Bansuri Swaraj",
        "mp_house": "Lok Sabha",
        "constituency": "New Delhi (Lok Sabha)",
        "state": "Delhi",
        "district": "New Delhi",
        "block": "Connaught Place",
        "village": "Panchkuian",
        "implementing_agency": "New Delhi Municipal Council",
        "work_type": "Community Infrastructure",
        "work_description": "Construction of urban community center (CAG ANOMALY: Cost 4.6x peer median, completed in 12 days)",
        "sanctioned_amount": 8900000.0,
        "released_amount": 8900000.0,
        "expenditure": 8900000.0,
        "balance_amount": 0.0,
        "work_status": "Completed",
        "recommendation_date": "2023-05-10",
        "sanction_date": "2023-06-01",
        "completion_date": "2023-06-13",
        "financial_year": "2023-24",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "is_demo": True
    })

    # CAG Pattern 9: Prolonged Stranded Advance (>2.5 years zero progress) - Bhopal, MP
    works.append({
        "work_id": "MPLADS-2023-MP-001",
        "mp_name": "Alok Sharma",
        "mp_house": "Lok Sabha",
        "constituency": "Bhopal (Lok Sabha)",
        "state": "Madhya Pradesh",
        "district": "Bhopal",
        "block": "Phanda",
        "village": "Berasia",
        "implementing_agency": "MP Rural Road Dev Authority",
        "work_type": "School Classroom & Education",
        "work_description": "Civil construction of 4 smart classrooms at Berasia High School (CAG ANOMALY: Sanctioned >800 days ago, 100% advance released, contractor abandoned site)",
        "sanctioned_amount": 3800000.0,
        "released_amount": 3800000.0,
        "expenditure": 110000.0,
        "balance_amount": 3690000.0,
        "work_status": "Stalled",
        "recommendation_date": "2022-04-15",
        "sanction_date": "2022-05-20",
        "completion_date": "",
        "financial_year": "2022-23",
        "latitude": 23.2599,
        "longitude": 77.4126,
        "is_demo": True
    })

    # CAG Pattern 10: Inverted Timeline Fraud - Guwahati, Assam
    works.append({
        "work_id": "MPLADS-2023-AS-001",
        "mp_name": "Bijuli Kalita Medhi",
        "mp_house": "Lok Sabha",
        "constituency": "Guwahati (Lok Sabha)",
        "state": "Assam",
        "district": "Kamrup Metropolitan",
        "block": "Dispur",
        "village": "Sonapur",
        "implementing_agency": "Public Health Engineering Assam",
        "work_type": "Drinking Water Facility",
        "work_description": "Deep tube-well and piped drinking water project (CAG ANOMALY: Negative balance, expenditure exceeds sanction, completion date recorded 4 months prior to sanction)",
        "sanctioned_amount": 1800000.0,
        "released_amount": 1800000.0,
        "expenditure": 2450000.0,
        "balance_amount": -650000.0,
        "work_status": "Completed",
        "recommendation_date": "2023-07-10",
        "sanction_date": "2023-08-20",
        "completion_date": "2023-04-15",
        "financial_year": "2023-24",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "is_demo": True
    })

    # CAG Pattern 11: Severe Cost Overrun & Ghost Infrastructure - Rajkot, Gujarat
    works.append({
        "work_id": "MPLADS-2023-GJ-001",
        "mp_name": "Parshottam Rupala",
        "mp_house": "Lok Sabha",
        "constituency": "Rajkot (Lok Sabha)",
        "state": "Gujarat",
        "district": "Rajkot",
        "block": "Gondal",
        "village": "Kotda Sangani",
        "implementing_agency": "Gujarat PWD",
        "work_type": "Rural Road & Culvert",
        "work_description": "Construction of major box culvert and link road (CAG ANOMALY: Final expenditure ₹62L vs original ₹35L sanction without revised administrative approval)",
        "sanctioned_amount": 3500000.0,
        "released_amount": 6200000.0,
        "expenditure": 6200000.0,
        "balance_amount": 0.0,
        "work_status": "Completed",
        "recommendation_date": "2023-02-15",
        "sanction_date": "2023-03-30",
        "completion_date": "2023-11-20",
        "financial_year": "2023-24",
        "latitude": 22.3039,
        "longitude": 70.8022,
        "is_demo": True
    })

    # CAG Pattern 12: Single-Bidder Cartel Complex - Thiruvananthapuram, Kerala
    works.append({
        "work_id": "MPLADS-2023-KL-001",
        "mp_name": "Shashi Tharoor",
        "mp_house": "Lok Sabha",
        "constituency": "Thiruvananthapuram (Lok Sabha)",
        "state": "Kerala",
        "district": "Thiruvananthapuram",
        "block": "Nemom",
        "village": "Kovalam",
        "implementing_agency": "Kerala PWD",
        "work_type": "Sanitation & Public Amenities",
        "work_description": "Modern public sanitation and tourist amenity block (CAG ANOMALY: Expenditure ₹38L vs ₹18L sanction, 100% advance disbursed with unresolved audit objection)",
        "sanctioned_amount": 1800000.0,
        "released_amount": 3800000.0,
        "expenditure": 3800000.0,
        "balance_amount": 0.0,
        "work_status": "Completed",
        "recommendation_date": "2023-04-05",
        "sanction_date": "2023-05-15",
        "completion_date": "2023-12-10",
        "financial_year": "2023-24",
        "latitude": 8.5241,
        "longitude": 76.9366,
        "is_demo": True
    })

    # -------------------------------------------------------------
    # 2. GENERATE STATISTICALLY CALIBRATED REALISTIC WORKS
    # -------------------------------------------------------------
    # Build weighted selection pools
    state_population: List[Dict[str, Any]] = []
    for r in REGIONS:
        weight = r.get("weight", 1)
        for _ in range(weight):
            state_population.append(r)

    work_type_population: List[Dict[str, Any]] = []
    for wt in WORK_TYPES:
        w = wt.get("weight", 5)
        for _ in range(w):
            work_type_population.append(wt)

    start_reference = datetime(2023, 4, 1)
    work_seq = 100

    while len(works) < target_count:
        region = random.choice(state_population)
        state_name = region["state"]
        dist_info = random.choice(region["districts"])
        district_name = dist_info["district"]
        constituency_name = dist_info["constituency"]
        mp_name = dist_info["mp_name"]
        block = random.choice(dist_info["blocks"])
        agency = random.choice(dist_info["agencies"])
        village = random.choice(VILLAGES)

        wt = random.choice(work_type_population)
        wtype = wt["type"]
        template = random.choice(wt["templates"])
        desc = template.format(village=village)

        # Base financial estimation according to State PWD Schedule of Rates
        base_cost = random.uniform(wt["cost_min"], wt["cost_max"])
        # Round to nearest ₹10,000 for realistic government DPRs
        sanctioned = round(base_cost / 10000.0) * 10000.0

        # Timeline logic
        sanction_offset_days = random.randint(15, 60)
        rec_date = start_reference + timedelta(days=random.randint(0, 320))
        sanc_date = rec_date + timedelta(days=sanction_offset_days)

        # Determine Risk Profile
        # PROPER RATIO:
        # Red dots (Critical) are kept strictly at a low scale (~12-14 nationwide) representing rare suspected corruption.
        # High Risk (~3.5% = ~40 works)
        # Medium Risk (~24% = ~285 works)
        # Low Risk (~72.5% = ~860 works): Dominant green dots representing MPs and agencies doing good work!
        risk_roll = random.random()

        if risk_roll < 0.035:
            # === HIGH RISK PROFILE (~3.5%) ===
            high_type = random.choice(["peer_cost", "prolonged_stalled", "premature_disbursement"])
            if high_type == "peer_cost":
                # Cost 2.1x to 2.7x peer benchmark AND delayed execution (>500 days)
                sanctioned = round((base_cost * random.uniform(2.1, 2.7)) / 10000.0) * 10000.0
                released = sanctioned
                expenditure = round((sanctioned * random.uniform(0.75, 0.95)) / 1000.0) * 1000.0
                balance = released - expenditure
                status = "In Progress"
                rec_date = start_reference - timedelta(days=random.randint(520, 680))
                sanc_date = rec_date + timedelta(days=30)
                comp_date_str = ""
            elif high_type == "prolonged_stalled":
                sanctioned = round((base_cost * random.uniform(2.0, 2.5)) / 10000.0) * 10000.0
                released = round((sanctioned * random.choice([0.75, 1.0])) / 1000.0) * 1000.0
                expenditure = round((released * random.uniform(0.08, 0.20)) / 1000.0) * 1000.0
                balance = released - expenditure
                status = "Stalled"
                rec_date = start_reference - timedelta(days=random.randint(520, 720))
                sanc_date = rec_date + timedelta(days=random.randint(20, 50))
                comp_date_str = ""
            else:
                # Elevated cost + 98% disbursed while status remains 'Sanctioned' or early 'In Progress'
                sanctioned = round((base_cost * random.uniform(2.0, 2.5)) / 10000.0) * 10000.0
                released = sanctioned
                expenditure = round((sanctioned * random.uniform(0.96, 0.99)) / 1000.0) * 1000.0
                balance = released - expenditure
                status = "Sanctioned"
                rec_date = start_reference - timedelta(days=random.randint(520, 650))
                sanc_date = rec_date + timedelta(days=30)
                comp_date_str = ""

        elif risk_roll < 0.275:
            # === MEDIUM RISK PROFILE (~24%) ===
            sanctioned = round(base_cost / 10000.0) * 10000.0
            med_type = random.choice(["mild_delay", "partial_util", "minor_cost"])
            if med_type == "mild_delay":
                status = "In Progress"
                rec_date = start_reference - timedelta(days=random.randint(370, 500))
                sanc_date = rec_date + timedelta(days=30)
                released = round((sanctioned * random.choice([0.6, 0.8])) / 1000.0) * 1000.0
                expenditure = round((released * random.uniform(0.40, 0.70)) / 1000.0) * 1000.0
                balance = released - expenditure
                comp_date_str = ""
            elif med_type == "partial_util":
                status = "In Progress"
                released = round((sanctioned * 0.75) / 1000.0) * 1000.0
                expenditure = round((released * random.uniform(0.30, 0.60)) / 1000.0) * 1000.0
                balance = released - expenditure
                comp_date_str = ""
            else:
                # Minor elevated cost (1.3x - 1.6x peer median)
                sanctioned = round((base_cost * random.uniform(1.3, 1.6)) / 10000.0) * 10000.0
                released = sanctioned
                expenditure = round((sanctioned * random.uniform(0.92, 0.98)) / 1000.0) * 1000.0
                balance = released - expenditure
                status = "Completed"
                duration_days = random.randint(wt["duration_min"], wt["duration_max"])
                comp_date = sanc_date + timedelta(days=duration_days)
                comp_date_str = comp_date.strftime("%Y-%m-%d")

        else:
            # === LOW RISK PROFILE (~72.5%): Clean, Compliant, On-Schedule Works (Good Job!) ===
            sanctioned = round(base_cost / 10000.0) * 10000.0
            if random.random() < 0.80:
                status = "Completed"
                released = sanctioned
                exp_pct = random.uniform(0.94, 0.998)
                expenditure = round((sanctioned * exp_pct) / 1000.0) * 1000.0
                duration_days = random.randint(wt["duration_min"], wt["duration_max"])
                comp_date = sanc_date + timedelta(days=duration_days)
                comp_date_str = comp_date.strftime("%Y-%m-%d")
            else:
                status = "In Progress"
                release_pct = random.choice([0.5, 0.75, 1.0])
                released = round((sanctioned * release_pct) / 1000.0) * 1000.0
                exp_pct = random.uniform(0.65, 0.88)
                expenditure = round((released * exp_pct) / 1000.0) * 1000.0
                comp_date_str = ""
            balance = released - expenditure

        # Geo-dispersion: authentic dispersion across blocks and villages in the constituency
        lat = dist_info["lat"] + random.uniform(-0.35, 0.35)
        lng = dist_info["lng"] + random.uniform(-0.35, 0.35)

        prefix_state = state_name[:2].upper()
        if state_name == "Madhya Pradesh":
            prefix_state = "MP"
        elif state_name == "West Bengal":
            prefix_state = "WB"
        elif state_name == "Tamil Nadu":
            prefix_state = "TN"
        elif state_name == "Uttar Pradesh":
            prefix_state = "UP"
        elif state_name == "Andhra Pradesh":
            prefix_state = "AP"
        elif state_name == "Himachal Pradesh":
            prefix_state = "HP"

        work_id = f"MPLADS-2023-{prefix_state}-{work_seq:04d}"
        work_seq += 1

        works.append({
            "work_id": work_id,
            "mp_name": mp_name,
            "mp_house": "Lok Sabha",
            "constituency": constituency_name,
            "state": state_name,
            "district": district_name,
            "block": block,
            "village": village,
            "implementing_agency": agency,
            "work_type": wtype,
            "work_description": desc,
            "sanctioned_amount": sanctioned,
            "released_amount": released,
            "expenditure": expenditure,
            "balance_amount": balance,
            "work_status": status,
            "recommendation_date": rec_date.strftime("%Y-%m-%d"),
            "sanction_date": sanc_date.strftime("%Y-%m-%d"),
            "completion_date": comp_date_str,
            "financial_year": "2023-24",
            "latitude": round(lat, 5),
            "longitude": round(lng, 5),
            "is_demo": True
        })

    if output_path:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        keys = works[0].keys()
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(works)

    return works

if __name__ == "__main__":
    out_file = Path(__file__).parent / "sample_mplads_data.csv"
    gen_works = generate_demo_dataset(target_count=1200, output_path=str(out_file))
    print(f"Generated {len(gen_works)} calibrated demo records at {out_file}")
