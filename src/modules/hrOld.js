/**
 * Created by Awais 11/14/17.
 */

const sequelize = require('sequelize');

const {info, silly, debug, error} = require('./logger')
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
    ApplicationError,
} = require("./error");

const config = require('../config');
const dbName = config.DB_HR['DATABASE'];
const dbUsername = config.DB_HR['USERNAME'];
const dbPassword = config.DB_HR['PASSWORD'];
const dbDialect = config.DB_HR['DIALECT'];
const dbHost = config.DB_HR['HOST'];
const dbPort = config.DB_HR['PORT'];

let db = null

async function connect() {
    db = new sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        dialect: dbDialect,
        port: dbPort,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        dialectOptions: {
            encrypt: false
        },
        logging: config.DB_HR['QUERY_LOG']
    });

    db.authenticate()
        .then(function (err) {
            info('srv-prd1 DB Connection has been established successfully.');
        })
        .catch(function (err) {
            error('Unable to connect to the srv-db (Old HR) database: %o', err);
        });
}

async function querySelectEmp({MilitaryNo, ADUserName}) {
    try {

        if (!db)
            await connect()

        const response = db.query(`
        
SELECT      dbo.EMP.Employee_ID, dbo.EMP.Emp_Id, dbo.EMP.MilitaryNo, dbo.EMP.Role_ID, dbo.EMP.Branch_ID, dbo.EMP.Department_ID, dbo.EMP.Section, dbo.EMP.Unit_ID, dbo.EMP.Emp_Name, dbo.EMP.Gender_Id, dbo.EMP.Emp_EName, 
                         dbo.EMP.Grade_ID, dbo.Tbl_M_Grade.Grade_Ar, dbo.Tbl_M_Job.Job_Ar, dbo.EMP.Job_ID, dbo.EMP.Nationality_ID, dbo.EMP.Emp_Mobile, dbo.EMP.Emp_Email, dbo.EMP.BirthDate, dbo.EMP.BirthPlace, dbo.EMP.Direct_Tel_Number, dbo.EMP.Ext_Number, 
                         dbo.EMP.Mobile_Number1, dbo.EMP.Fax_Number, dbo.EMP.Blood_Type, dbo.EMP.Religion_ID, dbo.EMP.Height, dbo.EMP.SplMarks, dbo.EMP.NationalID, dbo.EMP.FamilyNo, dbo.EMP.PassportPrintSer, dbo.EMP.PassportNo, 
                         dbo.EMP.ResidenceNo, dbo.EMP.ResidenceEndDate, dbo.EMP.Emp_Hire_Date, dbo.EMP.RegisterPlace, dbo.EMP.SubstitueWorkYear, dbo.EMP.DailyOrder, dbo.EMP.Mgr_ID, dbo.EMP.IsManager, dbo.EMP.Notes, 
                         dbo.EMP.Emp_Workend_Date, dbo.EMP.Emp_Status, dbo.EMP.Data_Del_Flag, dbo.EMP.User_Add, dbo.EMP.Add_Date, dbo.EMP.User_Update, dbo.EMP.Update_Date, dbo.EMP.workplace_id, dbo.EMP.MStatus_ID, 
                         dbo.EMP.UnifiedCode, dbo.Tbl_Branch.Branch_Name, dbo.Tbl_M_Department.Department_Ar, dbo.Tbl_Section.Sec_Name, dbo.Tbl_Unit.Unit_Name
FROM        dbo.Tbl_M_Department RIGHT OUTER JOIN
                         dbo.Tbl_Section RIGHT OUTER JOIN
                         dbo.EMP ON dbo.Tbl_Section.Sec_ID = dbo.EMP.Section LEFT OUTER JOIN
                         dbo.Tbl_Unit ON dbo.EMP.Unit_ID = dbo.Tbl_Unit.Unit_ID ON dbo.Tbl_M_Department.Department_ID = dbo.EMP.Department_ID LEFT OUTER JOIN
                         dbo.Tbl_Branch ON dbo.EMP.Branch_ID = dbo.Tbl_Branch.Branch_ID LEFT OUTER JOIN
						 dbo.Tbl_M_Grade ON  dbo.Tbl_M_Grade.Grade_ID = dbo.EMP.Grade_ID LEFT OUTER JOIN
						 dbo.Tbl_M_Job ON dbo.Tbl_M_Job.Job_ID = dbo.EMP.Job_ID
WHERE       (
                dbo.EMP.Emp_Status = 1 and dbo.EMP.Data_Del_Flag = 1 
                ${MilitaryNo ? ' and dbo.EMP.MilitaryNo = ' + MilitaryNo : ''}
                ${ADUserName ? ' and dbo.EMP.Emp_Email = \'' + ADUserName + '@psa.ac.ae\'' : ''}
            ) 
  
        `, {type: sequelize.QueryTypes.SELECT})

        return response
    } catch (e) {
        error(e)
        throw ApplicationError(e)
    }

}

module.exports = {
    findOne: async ({MilitaryNo, ADUserName}) => {
        if (MilitaryNo || ADUserName) {
            const empResp = await querySelectEmp({MilitaryNo, ADUserName})
            if (empResp.length >= 0)
                return empResp[0]
            else
                throw new BadRequestError('Invalid MilitaryNo or ADUserName')
        }
        throw new BadRequestError('Provide MilitaryNo or ADUserName')
    },
    findAll: async () => {
        return await querySelectEmp({})
    }
};
