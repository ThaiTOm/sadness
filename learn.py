def parse_int(string):
    arr = {
        "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
        "eleven": "11", "twelve": "12", "thirteen": "13", "fourteen": "14", "fifthteen": "15", "sixteen": "16", "seventeen": "17", "eighteen": "18",
        "nineteen": "19", "twenty": "20", "thirty": "30", "forty": "40", "fifty": "50", "sixty": "60", "seventy": "70", "eighty": "80",
        "ninety": "90", "hundred": "00", "thousand": "000"}
    ans = ""
    string = string.split(" ")
    for value in string:
        if value in arr:
            ans += arr[value]
        elif value != "and":
            arra = value.split("-")
            ans += str(int(arr[arra[0]]) + int(arr[arra[1]]))
    # ans = ans.replace("0", "")
    print(ans)


parse_int("two thousand forty-six")
