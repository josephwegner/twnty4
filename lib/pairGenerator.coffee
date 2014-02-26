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

nums = [0..9]
ops = ["add", "subtract", "multiply", "divide"]
successfulPairs = []
for firstNum in nums
	for secondNum in nums
		for thirdNum in nums
			for fourthNum in nums
				pair = [firstNum, secondNum, thirdNum, fourthNum]
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