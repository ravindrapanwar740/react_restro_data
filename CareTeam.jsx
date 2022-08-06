// 

import React, { useState, useEffect } from "react";
import { lazily } from "react-lazily";
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Modal from "@mui/material/Modal";
import addIcon from "../../images/plus.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { postData } from "../../config/api";
import { Box } from "@mui/system";
import BasicModal from "../../utils/modal";
import EditTeamMate from "./editTeamMate";
import { ModalWrapper } from "../../utils/molecules";
import femaleAvatar from "../../images/female.svg";
import SelectInput from "../../utils/atoms/selectInput";
import BasicSwitches from "../../utils/switch";
import DeleteTeamMate from "./deleteTeamMate";
import DeleteTeam from "./deleteTeam";
import AddTeamMate from "./addTeamMate";
import AddCareTeam from "./AddCareTeam";
import EditCareTeam from "./EditCareTeam";
import { useDispatch, useSelector } from "react-redux";
import { getCareTeamList } from "../../redux/reducer/careTeam";
import { SectionLoader } from "../../utils/atoms";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import NoDataImage from "../../images/illustration.svg"
import { MoreMenu } from "../../utils/molecules";
import { ToolMenuButton } from "../../utils/atoms";
import editIcon from "../../images/pencil-fill.svg";
import TextLabel from "../../utils/textLabel";
import ReactPaginate from 'react-paginate';
import Pagination from '@mui/material/Pagination';
import './careteam.css'
import { globalTheme, alignments, themeColors } from '../../styles/index';
const { SearchBox, TableComponent } = lazily(() =>
  import("../../utils/molecules")
);
const { ButtonComponent } = lazily(() => import("../../utils/atoms"));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "700px",
  padding: "22px 28px 29px 26px",
  borderRadious: "12px",
  backgroundColor: "#fff",
  p: 4,
};


const useStyles = makeStyles({
  tableRoot: {
    position: 'relative',
    minHeight: '200px',
    '& .layover': {
      top: '16px',
      height: '90%'
    },
    '& .table-container': {
      '& .MuiTableContainer-root': {
        maxHeight: '75vh',
      }
    }
  },
  root: {
    ...globalTheme.section,
    '& .ellipsis': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .more-btn': {
      cursor: 'pointer',
      color: themeColors.borderActive,
      fontWeight: '600'
    },
  },
})

const modelStyles = makeStyles((theme) => ({
  model: {
    width: "700px",
  },
  searchInput: {
    padding: "1 0 0 16px",
    borderRadious: "8px",
    border: "solid 1.4px #2c5683",
    backgroundColor: "#fff",
    height: "44px",
    "& .MuiOutlinedInput-root": {
      padding: "0px ",

      "& .MuiInputBase-input": {
        padding: "0 0 0 10px ",
        height: "44px",
      },
    },
  },
  closeButton: {
    position: "absolute",
    padding: "8px",
    borderRadius: "8px",
    border: "solid 1px #dbdbdb",
    backgroundColor: "#fff",
    right: "16px",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    cursor: "pointer",
  },
  dropdownContainer: {
    display: "inline-block",
    width: 150,
  },
  loaderHeight: {
    position: "fixed",
  }
}));
const CareTeam = () => {
  const classes = useStyles();
  const navigation = useNavigate();
  const location = useLocation();
  const [tableData, setTableData] = useState([]);
  const [editTeam, setEditTeam] = useState(false);
  const [individualData, setIndividualData] = useState({});
  const [tableTeamMateData, setTableTeamMateData] = useState([]);
  const [careTeamData, setCareTeamData] = useState([]);
  const [addTeammateModelVisibility, setAddTeammateModelVisibility] = useState(false);
  const [addTeamEditModelVisibility, setAddTeamEditModelVisibility] = useState(false);
  const [inviteTeamModelVisibility, setInviteTeamModelVisibility] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [addTeammate, setAddTeammate] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteTeamMate, setDeleteTeamMate] = useState({
    visibility: false,
    data: [],
  });
  const [groupDataId, setGroupDataId] = React.useState("");
  const [singleTeamData, setSingleTeamData] = React.useState({});
  const [singleTeamMember, setSingleTeamMember] = React.useState({});
  const [perPage] = React.useState([10]);
  const [page, setPage] = React.useState([0]);
  const [pages, setPages] = React.useState([0]);

  const dispatch = useDispatch()

  const { careTeamList } = useSelector((state) => state.careTeamList);
  const { activateLoader } = useSelector((state) => state.activateLoader)
  const modelStyle = modelStyles();

  // HeadCell Id and Created table date attribute should be same to render.
  const facilityDataIdLocalStorage = localStorage.getItem('facilityDataId');

  const headCells = [
    { id: "name", label: t('dashboard.label.sortByName') },
    { id: "email", label: t('dashboard.action.email') },
    { id: "doctorStatus", label: t('careTeam.header.status'), hasTags: true },
    { id: "role", label: t('careTeam.header.role') },
    { id: "isLeadPhysician", label: t('dashboard.label.leadPhysician'), hasIcon: true },
    {
      id: "action",
      label: "",
      hasMoreAction: true,
      actionList: [{ name: "test1" }, { name: "test2" }],
    },
  ];

  const columns = [
    { id: "email", label: t('dashboard.action.email') },
    { id: "role", label: t('careTeam.header.role') },
    { id: "isLeadPhysician", label: t('dashboard.label.leadPhysician') },
    // { id: "action", label: t('dashboard.label.action') },
  ];

  function createData(
    hcpId,
    firstName,
    lastName,
    status,
    role,
    isheadconsultant,
    isowner,
    email
  ) {
    const name = firstName + " " + lastName;
    const action = [
      { name: t('dashboard.action.edit') },
      { name: t('notification.action.manageNotification') },
    ];
    const isLeadPhysician = { type: isheadconsultant ? "checkCircle" : "" };
    const doctorStatus = {
      label: status,
      type: status == "Active" ? "active" : "disabled",
    };
    return {
      hcpId,
      name,
      doctorStatus,
      role,
      isLeadPhysician,
      isowner,
      email,
      action,
    };
  }

  function createAddTeammateData(
    // hcpId,
    // firstName,
    // lastName,
    // status,
    // action,
    // isheadconsultant,
    // isowner,
    email
  ) {
    const name = (
      <>
        <Grid container>
          <Grid item xs={3}>
            <img
              style={{ width: "40px" }}
              // className={classes.profileImage}
              src={femaleAvatar}
              alt="female"
            />
          </Grid>
          <Grid item xs={8} justifyContent="left">
            {/* <span>{firstName}</span> */}
            {/* <span>{lastName}</span> */}
            <div className="text-grey ">{email}</div>
          </Grid>
        </Grid>
      </>
    );
    const role = (
      <span className={modelStyle.dropdownContainer}>
        <SelectInput
          label="Role"
          options={[t('careTeam.label.admin'), t('careTeam.label.basic'), t('careTeam.label.leadPhysician')]}
          handleChange={() => { }}
        />
      </span>
    );
    const isLeadPhysician = (
      <>
        <BasicSwitches checked={true} onChange={() => { }} />
      </>
    );

    return {
      // hcpId,
      name,
      // doctorStatus,
      // role,
      // isLeadPhysician,
      // isowner,
      // email,
      // action,
    };
  }

  const createCareTeamList = (list) => {
    const data = list.map((item) => {
      return createData(
        item.hcpId,
        item.firstName,
        item.lastName,
        item.status,
        item.role,
        item.isheadconsultant,
        item.isowner,
        item.emailAdress
      );
    });
    const teamMateData = list.map((item) => {
      return createAddTeammateData(
        item.emailAdress
      );
    });
    setTableTeamMateData(teamMateData);
    setTableData(list);
    setCareTeamData(data);

  };

  const handleMenuClick = (event, groupId) => {

    switch (event.target.innerText.trim()) {
      case t('careTeam.action.deleteTeam'):
        return setOpenDeleteModal(true);
        break;
      case t('dashboard.action.edit'):
        return setAddTeamEditModelVisibilityAndData(true, groupId);
        break;
      case t('careTeam.action.invite_member'):
        return setInviteTeamModelVisibilityAndData(true, groupId);
    }
  };

  const setAddTeamEditModelVisibilityAndData = (Visibility, groupId) => {

    setGroupDataId(groupId);
    const found = tableData.find(obj => {
      return obj.sGroupID === groupId;
    });
    setSingleTeamMember(found);
    setAddTeamEditModelVisibility(Visibility);
  }

  const setInviteTeamModelVisibilityAndData = (Visibility, groupId) => {

    setGroupDataId(groupId);
    const found = tableData.find(obj => {
      return obj.sGroupID === groupId;
    });
    setSingleTeamData(found);
    setInviteTeamModelVisibility(Visibility);
  }
  const closeEditTeammateModal = (e, reason) => {
    if (reason && reason == "backdropClick")
      return;
    setEditTeam(false);
    setIndividualData({});
  };

  const _isOpenEditTeamModal = (data, isOpen) => {
    setEditTeam(!isOpen);
    setIndividualData(data);
  };

  const gotoNotification = (user) => {
    const { name } = user
    navigate("manage-notification/" + user.hcpId + `?name=${name}`);
  };

  const handleSearchCareTeam = (event) => {
    event.preventDefault();
    const searchParam = event.target.value;
    if (searchParam) {
      setTableData(
        careTeamList.filter((item) =>
          item.sName.toLowerCase().includes(searchParam.toLowerCase())
        )

      );

    } else {
      createCareTeamList(careTeamList)
      setPages(Math.ceil(careTeamList.length / perPage))
    }
  };
  const getMember = (member) => {
    const data = member.map((m) => {

      return m.firstName + " " + m.lastName
    });
    return data.join(",");

  }
  const handleAddTeammateModelClose = async (e, reason) => {
    if (reason && reason == "backdropClick")
      return;
    await setAddTeammateModelVisibility(false);
    //dispatch(getCareTeamList())

  };
  const handleInviteTeamModelClose = async (e, reason) => {
    if (reason && reason == "backdropClick")
      return;
    await setInviteTeamModelVisibility(false);
    //dispatch(getCareTeamList())
  };

  const handleEditTeamModelClose = (e, reason) => {
    if (reason && reason == "backdropClick")
      return;
    setAddTeamEditModelVisibility(false);
  };
  const clickTiles = (e) => {
    console.log("click event ", e);
  }
  const NoCareTeamMember = () => {
    const [showNoData, setShowNoData] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setShowNoData(true);
      }, 500)
    }, []);

    return (<>{showNoData && <Grid
      container
      item
      xs={12}
      justifyContent="center"
      alignContent={"center"}
      className={"f18 fw600 table-container main-image"}
      sx={{ color: '#228d89', height: '500px' }}
    >
      <Grid item><img src={NoDataImage} alt="NoData" />
        <Grid container item xs={12} className="main-image" justifyContent={"center"}>
          <p className='info-text'>{t('careTeam.label.noCareTeam')}</p>
        </Grid>

      </Grid>
    </Grid>}</>)
  }

  // useEffect(() => {
  //   dispatch(getCareTeamList({facilityID:facilityDataIdLocalStorage}))

  // }, [])

  useEffect(() => {
    if (careTeamList) {
      setPages(Math.ceil(careTeamList.length / perPage))
      createCareTeamList(careTeamList)
    }

  }, [careTeamList]);

  const handlePageClick = (e, p) => {

    setPage(p - 1);
  }
  useEffect(() => {
    setPages(Math.ceil(tableData.length / perPage))

  }, [tableData]);

  let tableDataPagination = tableData ? tableData.slice(page * perPage, (page + 1) * perPage) : tableData;

  return (
    <>

      <Grid container className="box-container">
        <BasicModal
          width="600px"
          open={addTeammateModelVisibility}
          onClose={handleAddTeammateModelClose}
          children={
            <AddCareTeam
              onClose={handleAddTeammateModelClose}
              header={columns}
              team_mates={tableTeamMateData}
              open={addTeammateModelVisibility}
              facilityID={facilityDataIdLocalStorage}
            />
          }
        />
        <BasicModal
          width="600px"
          open={inviteTeamModelVisibility}
          onClose={handleInviteTeamModelClose}
          children={
            <AddTeamMate
              onClose={handleInviteTeamModelClose}
              header={columns}
              team_mates={tableTeamMateData}
              careTeamName={singleTeamData.sName}
              open={inviteTeamModelVisibility}
              groupDataId={groupDataId}
            />
          }
        />
        <BasicModal
          width="600px"
          open={addTeamEditModelVisibility}
          onClose={handleEditTeamModelClose}
          children={
            <EditCareTeam
              onClose={handleEditTeamModelClose}
              header={columns}
              team_mates={tableTeamMateData}
              open={addTeamEditModelVisibility}
              member={singleTeamMember}
              facilityID={location?.state?.facilityDataId}
            />
          }
        />
        <BasicModal
          width="500px"
          open={editTeam}
          onClose={closeEditTeammateModal}
          children={
            <EditTeamMate
              onClose={closeEditTeammateModal}
              data={individualData}
              open={editTeam}
              facilityID={location?.state?.facilityDataId}
            />
          }
        />
        <BasicModal
          width="500px"
          open={deleteTeamMate.visibility}
          onClose={() => {
            setDeleteTeamMate({ visibility: false, data: [] });
          }}
          children={
            <DeleteTeamMate
              onClose={() => {
                setDeleteTeamMate({ visibility: false, data: [] });
              }}
              data={deleteTeamMate.data}
              open={deleteTeamMate.visibility}
            />
          }
        />

        <Grid container item xs={12}>
          <Grid
            container
            item
            xs={12}
            md={6}
            justifyContent="flex-start"
            alignContent={"center"}
            spacing={1}
          >
            <Grid item xs={12}>
              <h2 className="no-margin f16">{tableData?.length > 0 ? tableData.length : ""} {tableData?.length > 1 ? t('careTeam.label.careTeams') : t('careTeam.label.careTeam')}</h2>
            </Grid>
            {/* <Grid item xs={12}>
              <p className="text-grey no-margin">
              {t('careTeam.label.teamRole')}
              </p>
            </Grid> */}
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={6}
            justifyContent="flex-end"
            alignContent={"center"}
          >
            <Grid>
              <SearchBox
                handleChange={(e) => handleSearchCareTeam(e)}
                label={t('careTeam.action.searchTeam')}
                placeholder={t('careTeam.action.searchTeam')}
                size="medium"
              />
            </Grid>
            <Grid className="margin-button-add-care">
              {/* <ButtonComponent
                handleClick={() => {
                  // alert("good");
                  setAddTeammateModelVisibility(true);
                }}
                label={t('careTeam.action.addTeamMate')}
                hasIcon
              >
                <img src={addIcon}></img>
              </ButtonComponent> */}

              <ButtonComponent
                handleClick={() => {
                  // alert("good");
                  setAddTeammateModelVisibility(true);
                }}

                label={t('careTeam.action.addCareTeam')}
                hasIcon
              >
                <img src={addIcon}></img>
              </ButtonComponent>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} columnSpacing={3} className={`${classes.tableRoot}`}>
          {tableDataPagination && tableDataPagination.length > 0 ? (

            <>
              {
                tableDataPagination && tableDataPagination.map((dta, index) => {
                  return (
                    <Grid key={index} item xs={6}>
                      <Grid item className="careteam-btn-section">

                        <MoreMenu menuList={[{ name: t("careTeam.action.invite_member") }, { name: t('dashboard.action.edit') }]} isButton handleClick={handleMenuClick} groupId={dta.sGroupID} />
                      </Grid>
                      <Grid container item xs={12} id="ripple" className={classes.root+' pointer'} onClick={() => navigation("/patient/care-team/details/" + dta.sGroupID)}>
                        <Grid className="main-boxes" item xs={10} marginBottom="20px" >

                          <TextLabel value={dta.sName} color="#222222" fontSize="16px" />

                          <TextLabel value={getMember(dta.members)} color="#999999" fontSize="13px" />
                          <TextLabel value={dta.sDescription} className="care-team-desc" color="#999999" fontSize="13px" marginTop="10px" />


                        </Grid>
                        <Grid container item xs={2} spacing={1} justifyContent={"flex-end"} alignContent={"center"}>

                        </Grid>
                      </Grid>

                    </Grid>


                  )
                })
              }
            </>

          ) : (
            <>{activateLoader && !activateLoader.careTeamListLoader && <NoCareTeamMember />}</>
          )}
          {activateLoader && activateLoader.careTeamListLoader && <SectionLoader customClass={modelStyle.loaderHeight} />}
        </Grid>
        <Grid className="pagination-body" xs={12}>
          <div>

            <Pagination
              color="primary"
              className="my-3 "
              count={pages}
              shape="rounded"
              onChange={(event, value) => handlePageClick(event, value)}
            />
          </div>

        </Grid>

      </Grid>

      <ModalWrapper size="medium"
        isOpenModal={openDeleteModal}
        handleCloseModal={() => setOpenDeleteModal(false)}
      // title={settingsModalHeader}
      >
        <DeleteTeam handleClose={() => setOpenDeleteModal(false)} />
      </ModalWrapper>

    </>

  );
};

export default CareTeam;