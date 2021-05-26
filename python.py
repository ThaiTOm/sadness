def sort_array(arr):
    odds = sorted((x for x in arr if x % 2 != 0), reverse=True)
    print(odds)
    print([x if x % 2 == 0 else odds.pop() for x in arr])


sort_array([1, 5, 3, 2, 4])
