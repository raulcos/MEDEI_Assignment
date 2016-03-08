module.exports = {
    "database": "mongodb://raul:admin@ds019628.mlab.com:19628/medeiapp",
    "port": process.env.PORT || 3000,
    "secureKey": "TotallyUnguessableKey" //used for encoding the password
};