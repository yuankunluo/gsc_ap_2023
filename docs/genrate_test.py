import csv  

header = ["m_code", "name", "table","seat"]

data = [
    (f"code_{i}", f"name_{i}", f"table_{i/1000}", f"seat_{i/10}") for i in range(10000)
]

f = open('test.csv', 'w', newline='')

writer = csv.writer(f)

writer.writerow(header)
writer.writerows(data)

f.close