exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    try {

        const data = JSON.parse(event.body);

        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyO1oMooOLvlSUSPyUL_eU0-iZ1QcYXZJ1PGdS3s41YB8Uw2XGjfvJmJLHGPj3OdMXE/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const text = await response.text();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: true,
                result: text
            })
        };

    } catch (err) {

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                success: false,
                error: err.message
            })
        };

    }

};