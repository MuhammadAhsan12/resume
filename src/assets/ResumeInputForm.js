import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Datetime from "react-datetime";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import ResumeTemplate from './ResumeTemplate';
import 'react-datetime/css/react-datetime.css';
import './ResumeTemplate.css';

// styles for the drop downs and chips
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
      backgroundColor: 'white'
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
      background: 'cadetblue',
      color: 'white',
      fontWeight: 'bold',
      textShadow: '1px 1px black'
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    selectRoot: {
      '&:focus':{
         backgroundColor:'white'
      }
    }
  }));
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  function getStyles(name, selectedSkills, theme) {
    return {
      fontWeight:
        selectedSkills.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

function ResumeInputForm() {
    const classes = useStyles();
    const theme = useTheme();

    const [educationCount, setEducationCount] = useState(1);
    const [workExpCount, setWorkExpCount] = useState(1);

    // Personal fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [role, setRole] = useState('');
    const [objective, setObjective] = useState('');

    // Contact fields
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');

    // Education fields
    const [educationDetails, setEducationDetails] = useState([
        {cname: '', sname: '', course: '', fromMonth: '', toMonth: ''},
        {cname: '', sname: '', course: '', fromMonth: '', toMonth: ''},
        {cname: '', sname: '', course: '', fromMonth: '', toMonth: ''}
    ]);

    // Work Experience fields
    const [workExpDetails, setWorkExpDetails] = useState([
        {designation: '', company: '', responsibilities: '', startMonth: '', endMonth: '', presentWork: false},
        {designation: '', company: '', responsibilities: '', startMonth: '', endMonth: '', presentWork: false},
        {designation: '', company: '', responsibilities: '', startMonth: '', endMonth: '', presentWork: false}
    ]);

    // Profile image
    const [image, setImage] = useState('');
    const [isImage, setIsImage] = useState(false);

    const [showResume, setShowResume] = useState(false);

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);

    const skills = ['HTML', 'CSS', 'Java Script', 'React.JS'];
  
    const hobbies = ['Reading', 'Music', 'Gaming', 'Gardening']

    var idList = ['fname', 'lname', 'role', 'objective', 'phone', 'email',
    'website', 'address']

    useEffect(() => {
        sessionStorage.setItem("reloading", "true");
    }, []);
    
    // Ensure that form is cleared on page refresh
    window.onload = function() {
        const reloading = sessionStorage.getItem("reloading");
        if (reloading) {
            sessionStorage.removeItem("reloading");
            clearAll();
        }
    }

    // Additional validations before submitting the form
    const checkValidity = () => {
        const validity = idList.map((item, index) => {
            if (!document.getElementById(item).validity.valid || !selectedHobbies.length || !selectedSkills.length || !isImage || checkDates()) {
                return false;
            }
            return true;
        });
        return validity.some((item, index) => {
            return item === false;
        });
    }

    const checkDates = () => {
        let flag = false;
        educationDetails.map((element, index) => {
            if (element.cname.length > 0 && !(element.fromMonth || element.toMonth)) {
                flag = true;
            } else if (element.cname.length > 0 && element.fromMonth && element.toMonth && ((element.fromMonth > element.toMonth) || element.toMonth > 2021)) {
                flag = true;
            }
            return 0;
        });
        workExpDetails.map((element, index) => {
            // if (element.designation.length > 0 && (!element.startMonth || !(element.endMonth || element.presentWork))) {
            //     flag = true;
            // } 
            // if (element.designation.length > 0 && !element.presentWork) {
            //     if (element.designation.length > 0 && element.startMonth && element.endMonth && element.startMonth > element.endMonth) {
            //     flag = true;
            // }
            // }
            // return 0;
            if (element.presentWork) {
                if (isNaN(element.startMonth)) {
                    flag = true;
                }
            } else {
                if (element.designation.length > 0 && (!(element.startMonth || element.endMonth) || (isNaN(element.startMonth || isNaN(element.endMonth))))) {
                    flag = true;
                }
                if (element.designation.length > 0 && element.startMonth && element.endMonth && ((element.startMonth > element.endMonth) || (element.endMonth > 2021))) {
                    flag = true;
                }
            }
            return 0;
        });
        return flag;
    }

    const loadFile = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        setImage(base64String);
        setIsImage(true);
        };
        reader.readAsDataURL(file);
    }

    const handleChange = (event) => {
        setSelectedSkills(event.target.value);
    };
    
    const handleChangeHobbies = (event) => {
        setSelectedHobbies(event.target.value);
    };

    const onChangeEducationFields = (value, field, id) => {
        const obj = {
            ...educationDetails[id - 1],
            [`${field}`]: value
        }
        const latestData = educationDetails.map((el, index ) => (index === (id - 1) ? obj : el))
        setEducationDetails(latestData);
    }

    const onChangeWorkFields = (value, field, id) => {
        const obj = {
            ...workExpDetails[id - 1],
            [`${field}`]: value
        }
        const latestData = workExpDetails.map((el, index ) => (index === (id - 1) ? obj : el))
        setWorkExpDetails(latestData);
    }

    const expand = (id) => {
        const coll = document.getElementById(id);
        coll.classList.toggle("active");
            let content = coll.nextElementSibling;
            if (content.style.display === "flex") {
                coll.lastChild.className="fas fa-caret-down"
                content.style.display = "none";
                // coll.classList.toggle("marginBottom");
            } else {
                content.style.display = "flex";
                coll.lastChild.className="fas fa-caret-up"
                content.style.marginBottom = "20px";
                // coll.classList.toggle("marginBottom");
            }
    }

    const personalFields = () => {
        return (
            <>
                <div className="form-group">
                    <input type="text" name="fname" id="fname" placeholder="First Name" value={fname} onChange={(e) => {setFname(e.target.value)}} required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" name="lname" id="lname" placeholder="Last Name" value={lname} onChange={(e) => {setLname(e.target.value)}} required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" name="role" id="role" placeholder="Job Role" value={role} onChange={(e) => {setRole(e.target.value)}} required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" name="objective" id="objective" placeholder="Objective" value={objective} onChange={(e) => {setObjective(e.target.value)}} required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
            </>
        );
    }

    const contactFields = () => {
        return (
            <>
                <div className="form-group">
                    <input type="tel" value={phone}onChange={(e) => {setPhone(e.target.value)}} name="telephone" id="phone" placeholder="Phone Number (EX: 669-306-1518)" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} name="email" id="email" placeholder="Email (EX: emailid@something.com)"required />  
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="url" value={website} onChange={(e) => {setWebsite(e.target.value)}} name="website" id="website" placeholder="Website (EX: http://example.com)" />
                </div>
                <div className="form-group">
                    <input type="text" value={address} onChange={(e) => {setAddress(e.target.value)}} name="address" id="address" placeholder="Address" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
            </>
        );
    }

    const educationFields = (id) => {
        idList.push(`cname${id}`);
        idList.push(`sname${id}`);
        idList.push(`course${id}`);
        return (
            <>
                <div className="form-group">
                    <input type="text" value={educationDetails[id-1].cname} onChange={(e) => {onChangeEducationFields(e.target.value, 'cname', id)}} name={`cname${id}`} id={`cname${id}`} placeholder="Course Name" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" value={educationDetails[id-1].sname} onChange={(e) => {onChangeEducationFields(e.target.value, 'sname', id)}} name={`sname${id}`} id={`sname${id}`} placeholder="School, College, or University Name" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" value={educationDetails[id-1].course} onChange={(e) => {onChangeEducationFields(e.target.value, 'course', id)}} name={`course${id}`} id={`course${id}`} placeholder="Course details / Major" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group"> 
                    <Datetime
                        // value={educationDetails[id-1].fromMonth.toString()}
                        inputProps={{name: `fromMonth${id}`, placeholder: 'Starting Date', value: educationDetails[id-1].fromMonth.toString()}}
                        timeFormat={false}
                        // name={`fromMonth${id}`}
                        id={`fromMonth${id}`}
                        dateFormat="YYYY"
                        closeOnSelect
                        onChange={(date) => { if(date._d) {
                        onChangeEducationFields(date._d.getFullYear() , 'fromMonth', id);}
                    }}/>
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <Datetime
                        // value={educationDetails[id-1].toMonth.toString()}
                        timeFormat={false}
                        inputProps={{name: `toMonth${id}`, placeholder: 'Ending Date', value: educationDetails[id-1].toMonth.toString()}}
                        // name={`toMonth${id}`}
                        id={`toMonth${id}`}
                        dateFormat="YYYY"
                        closeOnSelect
                        onChange={(date) => { if(date._d) {
                        onChangeEducationFields(date._d.getFullYear() , 'toMonth', id);}
                    }}/>
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <hr style={{width: '80%', color: 'black'}} />
            </>
        )
    }

    const workExpFields = (id) => {
        idList.push(`designation${id}`);
        idList.push(`company${id}`);
        idList.push(`responsibilities${id}`);
        idList.push(`currentJob${id}`);
        return (
            <>
                <div className="form-group">
                    <input type="text" value={workExpDetails[id-1].designation} onChange={(e) => {onChangeWorkFields(e.target.value, 'designation', id)}} name={`designation${id}`} id={`designation${id}`} placeholder="Designation" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" value={workExpDetails[id-1].company} onChange={(e) => {onChangeWorkFields(e.target.value, 'company', id)}} name={`company${id}`} id={`company${id}`} placeholder="Company Name" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group">
                    <input type="text" value={workExpDetails[id-1].responsibilities} onChange={(e) => {onChangeWorkFields(e.target.value, 'responsibilities', id)}} id={`responsibilities${id}`} placeholder="Responsibilities" required />
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group"> 
                    <Datetime
                        // value={workExpDetails[id-1].startMonth.toString()}
                        timeFormat={false}
                        inputProps={{name: `startMonth${id}`, placeholder: 'Starting Date', value: workExpDetails[id-1].startMonth.toString()}}
                        // name={`startMonth${id}`}
                        id={`startMonth${id}`}
                        dateFormat="YYYY"
                        closeOnSelect
                        onChange={(date) => {
                        onChangeWorkFields(date._d.getFullYear() , 'startMonth', id);
                    }}/>
                    <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                </div>
                <div className="form-group" style={{display: 'flex', color: 'black', justifyContent: 'center'}}>
                    <input checked={workExpDetails[id-1].presentWork} onChange={(e) => {onChangeWorkFields(e.target.checked, 'presentWork', id)}} type="checkbox" id={`currentJob${id}`} name="currentJob" className="currentJob"/>
                    <label htmlFor="currentJob" style={{fontSize: '12px'}}>Presently working here</label>
                </div>
                <div className="form-group">
                    {!workExpDetails[id-1].presentWork && <>
                        <Datetime
                            timeFormat={false}
                            inputProps={{name: `endMonth${id}`, placeholder: 'Ending Date', value: workExpDetails[id-1].endMonth.toString()}}
                            // value={workExpDetails[id-1].endMonth.toString()}
                            // name={`endMonth${id}`}
                            id={`endMonth${id}`}
                            dateFormat="YYYY"
                            closeOnSelect
                            onChange={(date) => {
                            onChangeWorkFields(date._d.getFullYear() , 'endMonth', id);
                        }}/>
                        <span style={{color: 'red', alignSelf: 'baseline'}}>*</span>
                    </>}
                </div>
                <hr style={{width: '80%', color: 'black'}} />
            </>
        )
    }

    const generate = async (e) => {
        const coll = document.getElementsByClassName("collapsible");
        
        for (let i = 0; i < coll.length; i++) {
            coll[i].nextElementSibling.style.display = "flex";
            coll[i].nextElementSibling.style.marginBottom = "20px";
        }
        // const isInvalid = await checkValidity();

        // if (!isInvalid) {
            const formData = [{
                fname,
                lname,
                role,
                objective,
                phone,
                email,
                website,
                address,
                educationDetails,
                workExpDetails,
                skills: selectedSkills,
                hobbies: selectedHobbies,
                image
            }];
            await localStorage.setItem('formData', JSON.stringify(formData));
            setShowResume(true);

        // } else {
        //     alert("Please fill the form correctly (Fill all the required fields, select atleast 1 hobby,1 skill, and profile picture, ensure that from years are less than or equal to end years and end year not greater than current year)");
        //     clearAll();
        // }
    }
    
    const clearAll = () => {
        idList = ['fname', 'lname', 'role', 'objective', 'phone', 'email',
        'website', 'address'];

        for (let i = 1; i <= 3; i++) {
            if (document.getElementsByName(`fromMonth${i}`)) {
                document.getElementsByName(`fromMonth${i}`).value = ''
            }
            if (document.getElementsByName(`startMonth${i}`)) {
                document.getElementsByName(`startMonth${i}`).value = ''
            }
            if (document.getElementsByName(`toMonth${i}`)) {
                document.getElementsByName(`toMonth${i}`).value = ''
            }
            if (document.getElementsByName(`endMonth${i}`)) {
                document.getElementsByName(`endMonth${i}`).value = ''
            }
        }

        setSelectedHobbies([]);
        setSelectedSkills([]);

        setIsImage(false);
        setImage('')
        setShowResume(false);

        localStorage.setItem('formData', '');
        
        setEducationCount(1);
        setWorkExpCount(1);

        // Personal Details
        setFname('');
        setLname('')
        setRole('');
        setObjective('')

        // Contact fields
        setPhone('');
        setEmail('');
        setWebsite('');
        setAddress('');

        // Education fields
        setEducationDetails([
            {cname: '', sname: '', course: '', fromMonth: '', toMonth: ''},
            {cname: '', sname: '', course: '', fromMonth: '', toMonth: ''},
            {cname: '', sname: '', course: '', fromMonth: '', toMonth: ''}
        ]);

        // Work Experience fields
        setWorkExpDetails([
            {designation: '', company: '', responsibilities: '', startMonth: '', endMonth: '', presentWork: false},
            {designation: '', company: '', responsibilities: '', startMonth: '', endMonth: '', presentWork: false},
            {designation: '', company: '', responsibilities: '', startMonth: '', endMonth: '', presentWork: false}
        ]);

        if (document.getElementById("img")) {
            document.getElementById("img").value = "";
        }
    }
    return (
        <div className="wrapper">
            {!showResume ? 
            <div className="resumeForm">
                <h2 style={{color: 'darkslategray'}}>Resume Generator</h2>
                <form className="formwrap" id="form">
                    <button type="button" className="collapsible" id="personal" onClick={() => expand("personal")}> Personal Details<i className="fas fa-caret-down" aria-hidden="true"></i></button>
                    <div className="content">
                        {personalFields()}
                    </div>
                    <button type="button" className="collapsible" id="contactButton" onClick={() => expand("contactButton")}> Contact Details <i className="fas fa-caret-down" aria-hidden="true"></i></button>
                    <div className="content">
                        {contactFields()}
                    </div>
                    <button type="button" className="collapsible" id="educationButton" onClick={() => expand("educationButton")}>Education Details <i className="fas fa-caret-down" aria-hidden="true"></i></button>
                    <div className="content" id="educationWrap" style={{paddingBottom: '150px'}}>
                        {educationFields(1)}
                        {(educationCount === 2 || educationCount === 3 ) && educationFields(2)}
                        {educationCount === 3 && educationFields(3)}
                        <div className="addDeleteWrap">
                            <button type="button" className="addDeleteButton" disabled={educationCount === 3} style={{marginRight: '25px'}} onClick={() => setEducationCount(educationCount + 1)}> <i className="fas fa-plus" style={{color: educationCount === 3 ? 'lightgray' : 'gray'}}></i></button>
                            <button type="button" className="addDeleteButton" disabled={educationCount === 1} onClick={() => setEducationCount(educationCount - 1)}> <i className="fas fa-trash" style={{color: educationCount === 1 ? 'lightgray' : 'gray'}}></i></button>
                        </div>
                    </div>
                    <button type="button" className="collapsible" id="workExpButton" onClick={() => expand("workExpButton")}> Work Experience <i className="fas fa-caret-down" aria-hidden="true"></i></button>
                    <div className="content" id="workExpWrap" style={{paddingBottom: '150px'}}>
                        {workExpFields(1)}
                        {(workExpCount === 2 || workExpCount === 3 ) && workExpFields(2)}
                        {workExpCount === 3 && workExpFields(3)}
                        <div className="addDeleteWrap">
                            <button type="button" className="addDeleteButton" disabled={workExpCount === 3} style={{marginRight: '25px'}} onClick={() => setWorkExpCount(workExpCount + 1)}> <i className="fas fa-plus" style={{color: workExpCount === 3 ? 'lightgray' : 'gray'}}></i></button>
                            <button type="button" className="addDeleteButton" disabled={workExpCount === 1} onClick={() => setWorkExpCount(workExpCount - 1)}> <i className="fas fa-trash" style={{color: workExpCount === 1 ? 'lightgray' : 'gray'}}></i></button>
                        </div>
                    </div>
                    <button type="button" className="collapsible" id="skillsButton" onClick={() => expand("skillsButton")}> Skills <i className="fas fa-caret-down" aria-hidden="true"></i></button>
                    <div className="content">
                        <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-chip-label" style={{paddingLeft: '5px'}}>Select atleast one skill<span style={{color: 'red', alignSelf: 'baseline', marginLeft: '10px'}}>*</span></InputLabel>
                            <Select
                            labelId="demo-mutiple-chip-label"
                            classes={{ root: classes.selectRoot }}
                            id="demo-mutiple-chip"
                            multiple
                            value={selectedSkills}
                            onChange={handleChange}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                            >
                            {skills.map((name) => (
                                <MenuItem key={name} value={name} style={getStyles(name, selectedSkills, theme)}>
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                    <button type="button" className="collapsible" id="hobbiesButton" onClick={() => expand("hobbiesButton")}>Hobbies <i className="fas fa-caret-down" aria-hidden="true"></i></button>
                    <div className="content">
                        <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-chip-label" style={{paddingLeft: '5px'}}>Select atleast one hobby<span style={{color: 'red', alignSelf: 'baseline', marginLeft: '10px'}}>*</span></InputLabel>
                            <Select
                            classes={{ root: classes.selectRoot }}
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            value={selectedHobbies}
                            onChange={handleChangeHobbies}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                            >
                            {hobbies.map((name) => (
                                <MenuItem key={name} value={name} style={getStyles(name, selectedHobbies, theme)}>
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                    <label htmlFor="img" style={{color: 'black', alignSelf: 'baseline', marginBottom: '20px'}}>Select image to upload<span style={{color: 'red', alignSelf: 'baseline', marginLeft: '10px'}}>*</span></label>
                    <input type="file" id="img" name="img" accept="image/*" onChange={(event) => loadFile(event)} style={{color: 'white', background: '#476481', marginBottom: '20px'}}></input>
                    <div className="submitWrap">
                        <button type="submit" className="submit" id="submit" onClick={(e) => generate(e)}>Generate</button>
                        <button type="reset" className="submit" id="reset" onClick={() => clearAll()}>Reset</button>
                    </div>
                </form>
            </div> : <ResumeTemplate generateNew={clearAll} />}
            <div className="footer">
                <p>Copyright © since 2021 by Ghanashri M</p>
            </div>
        </div>
    );
}

export default ResumeInputForm;
