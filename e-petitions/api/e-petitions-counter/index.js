const AWS = require('aws-sdk');

exports.e_petitions_counter = async (event) => {
    getCounterFromStorage();
    return {
        statusCode: 200,
        body: JSON.stringify({
            counter: 12237
        })
    };
};

function getCounterFromStorage() {
    // todo: implement
}
