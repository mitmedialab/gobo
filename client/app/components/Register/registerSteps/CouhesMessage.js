import React, { Component } from 'react';

class CouhesMessage extends Component {
    render() {
        return (
            <div>
                    <div className="couhes-text">
                        <h2>CONSENT TO PARTICIPATE IN  NON-BIOMEDICAL RESEARCH</h2>
                        <h3>Gobo</h3>
                        {<h5>TL;DR: This is a MIT research project to study how people filter their social media feeds. We're tracking your use of the site, but will only publish it anonymously and in aggregate. We might follow up with you to hear more about what you think about Gobo. The MIT Institutional Review Board has approved of this study.</h5>}
                        <p>You are asked to participate in a research study conducted by Ethan Zuckerman, Rahul Bhargava (M.S.), Jasmin Rubinovitz (M.S.) and Alexis Hope (M.S.), from the MIT Media Lab at the Massachusetts Institute of Technology (M.I.T.) You were selected as a possible participant in this study because you are interested in online social media platforms. You should read the information below, and ask questions about anything you do not understand, before deciding whether or not to participate.</p>
                        <h3>PARTICIPATION AND WITHDRAWAL</h3>
                        <p>Your participation in this study is completely voluntary and you are free to choose whether to be in it or not. If you choose to be in this study, you may subsequently withdraw from it at any time without penalty or consequences of any kind.  The investigator may withdraw you from this research if circumstances arise which warrant doing so.</p>
                        <h3>PURPOSE OF THE STUDY</h3>
                        <p>This study will assess how you use a new website that lets you control what content, and from whom, you are exposed to from your various social media networks. We will analyze how you choose to filter and prioritize content based on criteria our website offers.</p>
                        <h3>PROCEDURES</h3>
                        <p>If you volunteer to participate in this study, we would ask you to do the following things: Create an account on our website, and authorize our site to pull in posts from your friends and pages you follow on various social media platforms.  Then you will have the opportunity to see a combined list of all the content in one place, and control how it is filtered and prioritized. We ask that you use our website for at least a month, trying various settings for the filters to control what you see.</p>
                        <h3>POTENTIAL RISKS AND DISCOMFORTS</h3>
                        <p>We do not foresee any potential risks or discomforts from this study.  All the content you control will be things you have chosen to follow on other social media websites.</p>
                        <h3>POTENTIAL BENEFITS</h3>
                        <p>We hope this study helps you understand how social media websites create algorithms to control what you see and in which order. This may expose you to a wider set of points of view, perhaps changing your social media habits.</p>
                        <p>At a broader scale, this study may show that social media users want to be in control of how the content they see if selected and filtered.</p>
                        <h3>PAYMENT FOR PARTICIPATION</h3>
                        <p>You will not receive any payment for participating in this study.</p>
                        <h3>CONFIDENTIALITY</h3>
                        <p>Any information that is obtained in connection with this study and that can be identified with you will remain confidential and will be disclosed only with your permission or as required by law. In addition, your information may be reviewed by authorized MIT representatives to ensure compliance with MIT policies and procedures.</p>
                        <p>Aggregate data about your usage of our website may be published in academic journals or in the popular press.</p>
                        <p>If you agree to it, we may audio record an informal interview with you after the main part of the study.  These tapes would only be accessible to the research team listed above, and would be retained and encrypted digitally to inform further research for up to 1 year after the study is completed.</p>
                        <p>Since we are asking for you authorization to pull in content from other social media websites, the data about your usage of the website could be personally identified.  Our analysis of usage patterns will not be, except for participants that elect to do an interview with us. The content pulled in will be stored in a database, and will be deleted after the study is completed.</p>
                        <h3>IDENTIFICATION OF INVESTIGATORS</h3>
                        <p>If you have any questions or concerns about the research, please feel free to contact Ethan Zuckerman at (413) 441-3380 or ethanz@media.mit.edu.</p>
                        <h3>EMERGENCY CARE AND COMPENSATION FOR INJURY</h3>
                        <p>If you feel you have suffered an injury, which may include emotional trauma, as a result of participating in this study, please contact the person in charge of the study as soon as possible.</p>
                        <p>In the event you suffer such an injury, M.I.T. may provide itself, or arrange for the provision of, emergency transport or medical treatment, including emergency treatment and follow-up care, as needed, or reimbursement for such medical services.  M.I.T. does not provide any other form of compensation for injury. In any case, neither the offer to provide medical assistance, nor the actual provision of medical services shall be considered an admission of fault or acceptance of liability. Questions regarding this policy may be directed to MIT’s Insurance Office, (617) 253-2823. Your insurance carrier may be billed for the cost of emergency transport or medical treatment, if such services are determined not to be directly related to your participation in this study.</p>
                        <h3>RIGHTS OF RESEARCH SUBJECTS</h3>
                        <p>You are not waiving any legal claims, rights or remedies because of your participation in this research study.  If you feel you have been treated unfairly, or you have questions regarding your rights as a research subject, you may contact the Chairman of the Committee on the Use of Humans as Experimental Subjects, M.I.T., Room E25-143B, 77 Massachusetts Ave, Cambridge, MA 02139, phone 1-617-253 6787.</p>
                    </div>



                    <button className="button button_wide" onClick={this.props.onFinish}>I Agree</button>
            </div>
        )
    }
}

export default CouhesMessage
