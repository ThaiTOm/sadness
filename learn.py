def snail(arr):
    result = []
    i = 0
    for x in range(len(arr)):
        result.append(arr[i][x])
        if x == len(arr) - 1:
            for y in range(1, len(arr)):
                result.append(arr[y][x])
            for y in range(len(arr) - 1, 0, -1):
                print(x, y)
                result.append([x][y])
    print(result)


snail([[1, 2, 3],
       [4, 5, 6],
       [7, 8, 9]])
