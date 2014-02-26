doNumbersAddUp = (numbers, operations) ->
	currentValue = numbers[0]

	for number, index in numbers[..-2]

		switch operations[index]
			when "add"
				currentValue += numbers[index + 1]

			when "subtract"
				currentValue -= numbers[index + 1]

			when "multiply"
				currentValue = currentValue * numbers[index + 1]

			when "divide"
				currentValue = currentValue / numbers[index + 1]

	return currentValue == 24;

nums = [1..9]
ops = ["add", "subtract", "multiply", "divide"]
successfulPairs = []
for firstNum in nums
	for secondNum in nums
		for thirdNum in nums
			for fourthNum in nums
				pair = [firstNum, secondNum, thirdNum, fourthNum]

				#Pairs with either 8&3 or 6&4 and two other matching numbers are lame, cause you just
				#do 8*3+7-7...  lame-o
				if pair.indexOf(8) != -1 && pair.indexOf(3) != -1
					testPair = pair.slice()
					testPair.splice testPair.indexOf(3), 1
					testPair.splice testPair.indexOf(8), 1
					if testPair[0] == testPair[1]
						continue
				if pair.indexOf(6) != -1 && pair.indexOf(4) != -1
					testPair = pair.slice()
					testPair.splice testPair.indexOf(4), 1
					testPair.splice testPair.indexOf(6), 1
					if testPair[0] == testPair[1]
						continue

				#If all the numbers add up to 24, it will be an auto-win for everyone..  which is bad
				if (firstNum + secondNum + thirdNum + fourthNum) == 24
					continue

				success = false

				for firstOp in ops
					break if success
					for secondOp in ops
						break if success
						for thirdOp in ops
							break if success
							operations = [firstOp, secondOp, thirdOp]

							if doNumbersAddUp pair, operations
								successfulPairs.push pair
								success = true

console.log "#{successfulPairs.length} successful pairs"
module.exports = successfulPairs