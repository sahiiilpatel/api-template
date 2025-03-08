'use strict'

const Joi = require('joi')
const nodemailer = require('nodemailer')
Joi.objectId = require('joi-objectid')(Joi)
const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

module.exports = class ProjectInquiryService extends Schmervice.Service {

    async projectInquiry(request) {
        try {
            const { payload: { name, role, phone, budget, projectType, companyName, aboutProject, email } } = request
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.SAHIL_GMAIL_USER,
                    pass: process.env.SAHIL_GMAIL_PASS
                },
            });

            //  <tr>
            //      <td>
            //          <div style="text-align: center; padding-bottom: 24px;"><img src="https://sahilpatel-portfolio.vercel.app/assets/images/logo.png" alt="email_logo" style="max-width: 130px; max-height: 50px;"/></div>
            //      </td>
            //  </tr>
            const mailOptions = {
                from: 'sahilpatel3584@gmail.com',
                to: 'sahilpatel3584@gmail.com',
                subject: `Project Inquiry`,
                html: `<!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Document</title>
               <style>
                   * {
                       margin: 0px;
                       padding: 0px;
                       box-sizing: border-box;
                   }
               </style>
               </head>
               <body>
               <div style="max-width: 600px; width: 100%; margin: 10px auto;">
                   <table style="width: 100%; border-collapse: collapse;">
                       <tbody>
                           <tr>
                               <td>
                                   <table class="bg-box" style="width: 100%; border-collapse: collapse; background-color: #101630; border-radius: 8px;">
                                    <tbody>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 24px 16px 12px; vertical-align: top; width: 150px; font-weight: 600;">Name</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 24px 0px 12px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 24px 16px 12px; vertical-align: top;">${name}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top; width: 150px; font-weight: 600;">Role</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top;">${role}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top; width: 150px; font-weight: 600;">Phone</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top;">${phone}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top; width: 150px; font-weight: 600;">Budget</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top;">${budget}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top; width: 150px; font-weight: 600;">Project Type</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top;">${projectType}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top; width: 150px; font-weight: 600;">Company Name</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top;">${companyName}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top; width: 150px; font-weight: 600;">About Project</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px; vertical-align: top;">${aboutProject}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px 24px; vertical-align: top; width: 150px; font-weight: 600;">Email</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 0px 24px; vertical-align: top;">:</td>
                                                <td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #ffffff; padding: 12px 16px 24px; vertical-align: top;">${email}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                               </td>
                           </tr>
                       </tbody>
                   </table>
               </div>
               </body>
               </html>`,
            };
            await transporter.sendMail(mailOptions);
            return { success: true, message: "Successful" }
        } catch (err) {
            errorHelper.handleError(err);
        }
    }
}