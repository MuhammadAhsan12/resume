import React, { useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";
import './ResumeTemplate.css';

const downloadPdf = () => {
  htmlToImage.toPng(document.getElementById('resume'), { quality: 0.95 })
  .then(function (dataUrl) {
    var link = document.createElement('a');
    link.download = 'my-image-name.jpeg';
    const pdf = new jsPDF();
    const imgProps= pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(dataUrl, 'PNG', 0, 0,pdfWidth, pdfHeight);
    pdf.save("download.pdf"); 
  });
}

function ResumeTemplate({generateNew}) {
	const formData = JSON.parse(localStorage.getItem('formData'));
	const skills = [
        {skill: 'HTML', icon: 'fa-html5'},
        {skill: 'CSS', icon: 'fa-css3-alt'},
        {skill: 'Java Script', icon: 'fa-js'},
        {skill: 'React.JS', icon: 'fa-react'},
    ];
    const hobbies = [
        {hobby: 'Reading', icon: 'fa-book'},
        {hobby: 'Music', icon: 'fa-music'},
        {hobby: 'Gaming', icon: 'fa-gamepad'},
        {hobby: 'Gardening', icon: 'fa-tree'},
    ];
	const latestSkills = skills.filter((item, index) => {
		return formData[0].skills.includes(item.skill);
	});
	const latestHobbies = hobbies.filter((item, index) => {
		return formData[0].hobbies.includes(item.hobby);
	});

	useEffect(() => {
		document.getElementById('profileImage').style.backgroundImage = `url(data:image/png;base64,${formData[0]?.image})`;
	}, [])

  return (
    <div className="wrapper">
      <div className="download">
        <button className="generateNew" onClick={() => {
			generateNew();
			window.location.reload(false)
		}}>Generate New</button>
        <button className="generateNew" onClick={() => downloadPdf()} >Download</button>
      </div>
		<div className="resume" id="resume">
			<div className="left">
				<div className="img_holder">
					<img className="imageClass" id="profileImage" alt="" />  
				</div>
				<div className="contact_wrap pb">
					<div className="title" style={{ color: '#bdc3c7' }}>
						Contact
					</div>
					<div className="contact">
						<ul>
							<li>
								<div className="li_wrap">
									<div className="icon"><i className="fas fa-mobile-alt" aria-hidden="true"></i></div>
									<div className="text">{formData[0].phone}</div>
								</div>
							</li>
							<li>
								<div className="li_wrap">
									<div className="icon"><i className="fas fa-envelope" aria-hidden="true"></i></div>
									<div className="text">{formData[0].email}</div>
								</div>
							</li>
							<li>
								<div className="li_wrap">
									<div className="icon"><i className="fab fa-weebly" aria-hidden="true"></i></div>
									<div className="text">{formData[0].website}</div>
								</div>
							</li>
							<li>
								<div className="li_wrap">
									<div className="icon"><i className="fas fa-map-signs" aria-hidden="true"></i></div>
									<div className="text">{formData[0].address}</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div className="skills_wrap pb">
					<div className="title" style={{ color: '#bdc3c7' }}>
						Skills
					</div>
					<div className="skills">
						<ul>
							{latestSkills.map((item, index) => {
								return (
									<li key={index}>
										<div className="li_wrap">
											<div className="icon"><i className={`fab ${item.icon}`}></i></div>
											<div className="text">{item.skill}</div>
										</div>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
				<div className="hobbies_wrap pb">
					<div className="title" style={{ color: '#bdc3c7' }}>
						hobbies
					</div>
					<div className="hobbies">
						<ul>
							{latestHobbies.map((item, index) => {
								return (
									<li>
										<div className="li_wrap">
											<div className="icon"><i className={`fas ${item.icon}`}></i></div>
											<div className="text">{item.hobby}</div>
										</div>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			</div>
			<div className="right">
				<div className="header">
					<div className="name_role">
						<div className="name" style={{ color: '#e0ffff' }}>
						 	{formData[0].fname} {formData[0].lname}
						</div>
						<div className="role">
							{formData[0].role}
						</div>
					</div>
					<div className="about">
						{formData[0].objective}
					</div>
				</div>
				<div className="right_inner">
					<div className="exp">
						<div className="title">
							experience
						</div>
						<div className="exp_wrap">
							<ul>
								{formData[0].workExpDetails.map((item, index) => {
									return (item.company) ?
									(<li key={index}>
										<div className="li_wrap">
											<div className="date">
												{item.startMonth} - {item.presentWork ? 'Present' : item.endMonth}
											</div>
											<div className="info">
												<p className="info_title">
													{item.designation}
												</p>
												<p className="info_com">
													{item.company}
												</p>
												<p className="info_cont">
													{item.responsibilities}
												</p>
											</div>
										</div>
									</li>) : ''
								})}
							</ul>
						</div>
					</div>
					<div className="education">
						<div className="title">
							Education
						</div>
						<div className="education_wrap">
							<ul>
								{formData[0].educationDetails.map((item, index) => {
									return (item.cname) ?
									(<li key={index}>
										<div className="li_wrap">
											<div className="date">
												{item.fromMonth} - {item.toMonth}
											</div>
											<div className="info">
												<p className="info_title">
													{item.cname}
												</p>
												<p className="info_com">
													{item.sname}
												</p>
												<p className="info_cont">
													{item.course}
												</p>
											</div>
										</div>
									</li>) : ''})}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  );
}

export default ResumeTemplate;