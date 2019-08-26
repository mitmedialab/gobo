import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CouhesMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ageConfirmed: false,
    };
  }

  handleClick = (e) => {
    this.setState({
      ageConfirmed: e.target.checked,
    });
  }

  render() {
    return (
      <div>
        <div className="couhes-text">
          <h2>Consent to Participate in Non-Biomedical Research</h2>
          <h3>Gobo</h3>
          <p><strong>Summary: This is a MIT research project to study how people filter their social media feeds. We are tracking your use of the site, but will only publish it anonymously and in aggregate. We might follow up with you to hear more about what you think about Gobo.</strong></p>
          <p>You are asked to participate in a research study conducted by Ethan Zuckerman, Rahul Bhargava (M.S.), Dennis Jen (M.S.) and Anna Chung (B.A.), from the MIT Media Lab at the Massachusetts Institute of Technology (M.I.T.).</p>
          <h4>Participation and Withdrawal</h4>
          <p>Your participation in this study is completely voluntary and you are free to choose whether to be in it or not. If you choose to be in this study, you may subsequently withdraw from it at any time without penalty or consequences of any kind.  The investigator may withdraw you from this research if circumstances arise which warrant doing so.</p>
          <h4>Purpose of the study</h4>
          <p>This study will assess how you use a new website that lets you control what content, and from whom, you are exposed to from your various social media networks. We will analyze how you choose to filter and prioritize content based on criteria our website offers.</p>
          <h4>Procedures</h4>
          <p>If you volunteer to participate in this study, we would ask you to do the following things: Create an account on our website, and authorize our site to pull in posts from your friends and pages you follow on various social media platforms. Then you will have the opportunity to see a combined list of all the content in one place, and control how it is filtered and prioritized. We ask that you use our website for at least a month, trying various settings for the filters to control what you see.
          </p>
          <h4>Potential Risks and discomforts</h4>
          <p>We do not foresee any potential risks or discomforts from this study.  All the content you control will be things you have chosen to follow on other social media websites.</p>
          <h4>Potential Benefits</h4>
          <p>We hope this study helps you understand how social media websites create algorithms to control what you see and in which order. This may expose you to a wider set of points of view, perhaps changing your social media habits.</p>
          <p>At a broader scale, this study may show that social media users want to be in control of how the content they see if selected and filtered.</p>
          <h4>Payment for participation</h4>
          <p>You will not receive any payment for participating in this study.</p>
          <h4>Privacy and Confidentiality</h4>
          <p>Any information that is obtained in connection with this study and that can be identified with you will remain confidential and will be disclosed only with your permission or as required by law. In addition, your information may be reviewed by authorized MIT representatives to ensure compliance with MIT policies and procedures.</p>
          <p>Aggregate data about your usage of our website may be published in academic journals or in the popular press.</p>
          <p>If you agree to it, we may audio record an informal interview with you after the main part of the study.  These tapes would only be accessible to the research team listed above and would be retained and encrypted digitally to inform further research for up to 1 year after the study is completed.</p>
          <p>Since we are asking for your authorization to pull in content from other social media websites, the data about your usage of the website could be personally identified.  Our analysis of usage patterns will not be associated with individual account names, except for participants that elect to do an interview with us.</p>
          <p>The purpose of the data collection is to assess how you use a new website that lets you control what content, and from whom, you are exposed to from your various social media networks. The information you provide will only be available to MIT. Your data will be secured through the following methods: The social media content will be stored on a server within MIT’s network. Access to the server will only be available to the project team via secure login from within the MIT network (ie. the database will not be accessible outside the MIT network). The access keys for acquiring the content will be stored in a separate database only accessible to the core team, with the same network access constraints.</p>
          <p>This information will be retained for according to the following: the social media content and access keys will be purged whenever a user chooses to close their account, or when the study is completed. Social media content will be refreshed regularly and only the most recent will be retained. The web application analytics, survey, and interview data will be retained to study usage patterns and inform any potential publications. These datasets will be digitally archived and locked with a password on an MIT computer for 1 year after the study is completed. You have the right to withdraw your data from the study at any time. To do so, contact Ethan Zuckerman at (413) 441-3380 or ethanz@media.mit.edu. If you withdraw from the study, no new information will be collected about you or from you by the study team.</p>
          <p>Your personal information will be transferred to the United States. You understand that the data protection and privacy laws of the United States may not offer you the same level of protection as those in the EEA.</p>
          <p>As part of your participation, we will collect certain personal information about you, including:  name, email, and social media profile information. In addition, we will collect special category data, your personal information that is especially sensitive: political opinions.</p>
          <p>We may modify our privacy policy as appropriate and may change or update the policy if we add new services or features. If any changes are made, we will make appropriate amendments and notify you. If changes are major, such that they affect your rights, safety or welfare, we will approach you and ask you to reaffirm your consent to the changes, giving you a chance to opt out.</p>
          <h4>Identification of Investigators</h4>
          <p>If you have any questions or concerns about the research, please feel free to contact Ethan Zuckerman at (617) 253-3962 or ethanz@media.mit.edu.</p>
          <h4>Rights of Research Subject</h4>
          <p>You are not waiving any legal claims, rights or remedies because of your participation in this research study.  If you feel you have been treated unfairly, or you have questions regarding your rights as a research subject, you may contact the Chairman of the Committee on the Use of Humans as Experimental Subjects, M.I.T., Room E25-143B, 77 Massachusetts Ave, Cambridge, MA 02139, phone (617) 253-6787.</p>
        </div>
        <div className="pull-right confirm-age">
          <input
            className="checkbox"
            name="confirm-age"
            type="checkbox"
            checked={this.state.age_confirmed}
            onClick={this.handleClick}
          />
          <label htmlFor="confirm-age" className="checkbox-label">I am 18 years or older</label>
        </div>
        <button disabled={!this.state.ageConfirmed} className="button button_wide" onClick={this.props.onFinish}>I Agree</button>
      </div>
    );
  }
}

CouhesMessage.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default CouhesMessage;
