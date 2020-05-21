import json
import glob
import re
import math

db = {"Planets" : {}}
for fn in glob.glob("*.txt"):
    print(fn)
    f = open(fn, "r")
    data = f.read();
                    
    body_name = re.search(r'Target body name: ([\w ]+){?',data).group(1).strip()

    ref_name = re.search(r'Center body name: ([\w ]+){?',data).group(1).strip()
    ref_MU = float(re.search(r'Keplerian GM    : ([\d.E\- ]+)',data).group(1))
    ref_frame = re.search(r'Reference frame : ([\w ]+){?',data).group(1)
    coordinate_system = re.search(r'Coordinate systm: ([\w /]+){?',data).group(1)
    matches = re.search(r'GM= ([\d.E\- ]+)',data)
    if matches == None:
        MU = 0.
    else:
        MU = matches.group(1)

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
        oe[5] = math.radians(float(row[9])) # true anomaly
        oe[0] = float(row[10]) # semi major axis in AU
        oe[6] = float(ref_MU) # mu for coord
        oe[7] = math.radians(float(row[8])) # mean anomaly
        data.append(oe[:])

    dt = JD[1]-JD[0]
    for i in range(2,len(JD)):
        if abs(JD[i]-JD[i-1])/dt > 1e-6:
            dt = 0
            break
    
    
    db["Planets"][body_name] = {}                
    db["Planets"][body_name]["Reference Center"] = ref_name
    db["Planets"][body_name]["Reference MU"] = ref_MU
    db["Planets"][body_name]["Reference Frame"] = ref_frame
    db["Planets"][body_name]["Reference Coordinate System"] = coordinate_system
    db["Planets"][body_name]["MU"] = MU
    db["Planets"][body_name]["Albedo"] = 0.
    db["Planets"][body_name]["Description"] = ""
    db["Planets"][body_name]["Orbital Elements Table"] = data
    db["Planets"][body_name]["Julian Day (TDB)"] = JD
    db["Planets"][body_name]["Time step"] = dt
    db["Planets"][body_name]["Orbiting Bodies"] = []

with open('solarsystem.json', 'w') as outfile:
    json.dump(db, outfile)
