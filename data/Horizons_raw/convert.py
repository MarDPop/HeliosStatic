import json
import glob
import re
import math

db = {"Planets" : {}}
for fn in glob.glob("*.txt"):
    print(fn)
    f = open(fn, "r")
    data = f.read();
                    
    body_name = re.search(r'Target body name: ([\w \-]+)?',data).group(1).strip()

    ref_name = re.search(r'Center body name: ([\w \-]+){?',data).group(1).strip()
    ref_MU = float(re.search(r'Keplerian GM    : ([\d.E\- ]+)',data).group(1)) # in AU3/d2
    ref_frame = re.search(r'Reference frame : ([\w ]+){?',data).group(1)
    coordinate_system = re.search(r'Coordinate systm: ([\w /]+){?',data).group(1)
    matches = re.search(r'GM= ([\d.E\- ]+)',data)
    if matches == None:
        MU = 0.0
    else:
        MU = float(matches.group(1))

    matches = re.search(r'RAD= ([\d.E\- ]+)\s+',data)
    if matches == None:
        matches = re.search(r'mean radius.*km.*=\s+([\d\.]+)[\+\- A-Z]+',data,re.IGNORECASE)
        if matches == None:
            matches = re.search(r'equatorial radius.*km.*=\s+([\d\.]+)[\+\- A-Z]+',data,re.IGNORECASE)
            if matches == None:
                matches = re.search(r'radius.*km.*=\s(\d+\.?\d+)[\+\- ]+',data,re.IGNORECASE)
                if matches == None:
                    Radius = 0.0
                else:
                    Radius = float(matches.group(1))
            else:
                Radius = float(matches.group(1))
        else:
            Radius = float(matches.group(1))
    else:
        Radius = float(matches.group(1))

    matches = re.search(r'ALBEDO= ([\d.E\- ]+)',data)
    if matches == None:
        Albedo = 0.5
    else:
        Albedo = float(matches.group(1))

    matches = re.search(r'ROTPER= ([\d.E\- ]+)',data)
    if matches == None:
        RotationPeriod = 0.0 #hours
    else:
        RotationPeriod = float(matches.group(1))
        

    OEs = re.search(r'SOE\n(.*)\$\$',data,re.DOTALL|re.M).group(1)

    lines = OEs.splitlines()

    data = []
    JD = []
    oe = [0,0,0,0,0,0,0,0]
    for line in lines:
        row = line.split(",")
        JD.append(float(row[0]))
        oe[1] = float(row[2]) # eccentricity
        oe[2] = math.radians(float(row[4])) # inclination
        oe[3] = math.radians(float(row[5])) # longitude of ascending node
        oe[4] = math.radians(float(row[6])) # argument of periapse
        oe[5] = math.radians(float(row[10])) # true anomaly
        oe[0] = float(row[11]) # semi major axis in AU
        oe[6] = float(ref_MU) # mu for coord
        oe[7] = math.radians(float(row[8])) # mean anomaly
        data.append(oe[:])

    dt = JD[1]-JD[0]
    for i in range(2,len(JD)):
        if abs((JD[i]-JD[i-1])-dt) > 1e-4:
            dt = 0
            break
        
    Img = "";

    if body_name == "Moon" :
        Img = "../media/images/2k_moon.jpg"
        
    if body_name == "Earth" :
        Img = "../media/images/8k_earth_daymap.jpg."

    if body_name == "Sun" :
        Img = "../media/images/2k_sun.jpg"

    if body_name == "Jupiter" :
        Img = "../media/images/2k_jupiter.jpg"

    if body_name == "Mars" :
        Img = "../media/images/2k_jupiter.jpg"

    db["Planets"][body_name] = {}                
    db["Planets"][body_name]["Ref. Center"] = ref_name
    db["Planets"][body_name]["Ref. MU"] = ref_MU
    db["Planets"][body_name]["Ref. Frame"] = ref_frame
    db["Planets"][body_name]["Ref. Coord Sys"] = coordinate_system
    db["Planets"][body_name]["Grav. Constants"] = {}
    db["Planets"][body_name]["Grav. Constants"]["MU"] = MU
    db["Planets"][body_name]["Radius"] = Radius
    db["Planets"][body_name]["Albedo"] = Albedo
    db["Planets"][body_name]["Rot. Period"] = RotationPeriod
    db["Planets"][body_name]["Img"] = Img
    db["Planets"][body_name]["Desc"] = ""
    db["Planets"][body_name]["Orb Elements"] = data
    db["Planets"][body_name]["JD (TDB)"] = JD
    db["Planets"][body_name]["DT"] = dt
    db["Planets"][body_name]["Orb Bodies"] = []

for body in db["Planets"]:
    if (db["Planets"][body]["Ref. Center"] in db["Planets"]):
        db["Planets"][db["Planets"][body]["Ref. Center"]]["Orb Bodies"].append(body)

with open('db.json', 'w') as outfile:
    json.dump(db, outfile)
