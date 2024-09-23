// Helper function to extract a random number and check if is winning
async function extractor(config) {
   
    // Obtain the winning probability from the data loaded in the JSON file
    const probability = config.totalPrizes / config.expectedSurveys;
    // Generate a random number, check if it falls within the probability
    // and save the result in a boolean variable
    const winner = Math.random() < probability;

    // Check the obtained value is winning
    if (winner) {
        return true;
    } else {
        return false;
    }
}

module.exports = extractor;