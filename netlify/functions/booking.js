const { google } = require("googleapis");

exports.handler = async (event) => {

    // Chỉ cho phép POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                success: false,
                message: "Method Not Allowed"
            })
        };
    }

    try {

        // Đọc dữ liệu gửi từ form
        const body = JSON.parse(event.body);

        // Kết nối Google Service Account
        const auth = new google.auth.JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            [
                "https://www.googleapis.com/auth/spreadsheets"
            ]
        );

        await auth.authorize();

        const sheets = google.sheets({
            version: "v4",
            auth
        });

        // Chuẩn bị dữ liệu
        const values = [[

            new Date().toLocaleString("vi-VN"),

            body.fullName || "",

            body.phone || "",

            body.email || "",

            body.service || "",

            body.location || "",

            body.budget || "",

            body.date || "",

            body.time || "",

            body.note || ""

        ]];

        // Ghi dữ liệu
        await sheets.spreadsheets.values.append({

            spreadsheetId:
                process.env.GOOGLE_SHEET_ID,

            range:
                "Đặt lịch!A:J",

            valueInputOption:
                "USER_ENTERED",

            insertDataOption:
                "INSERT_ROWS",

            requestBody: {
                values
            }

        });

        return {

            statusCode: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                success: true,

                message: "Booking created."

            })

        };

    }

    catch (err) {

        console.error(err);

        return {

            statusCode: 500,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                success: false,

                message: err.message

            })

        };

    }

};