import type { Page } from "types/Page";
import styles from 'styles/pages/EventDetail.module.css';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import EventService from "services/EventService";
import {
    Grid,
    Typography,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Event as EventIcon,
    ContactMailOutlined as ContactMailIcon,
    BadgeOutlined as BadgeIcon
} from '@mui/icons-material';

const EventDetail: Page = () => {
    const Router = useRouter();
    const { event_id } = Router.query;

    const [fetchData, { loading, error, data }] = useLazyQuery(EventService.GET_EVENT_DETAILS);

    useEffect(() => {
        if(!Router.isReady) return;
        fetchData({
            variables: {
                eventId: Number(event_id)
            }
        })
    }, [Router.isReady])
    

    if (loading || !data) return <p>Loading ...</p>;
    if (error) return `Error! ${error}`;

    console.log(data);

    return(
        <div className={styles.container}>
            <Grid container direction="column" spacing={4}>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" sx={{fontWeight: 600, textAlign: 'center', textTransform: 'uppercase'}}>
                                {data.event.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="body1">{data.event.desc}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid container item xs spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Grid container rowSpacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" display="flex" justifyContent="center">
                                            Event Date
                                        </Typography>
                                        <Divider/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" display="flex" justifyContent="center" alignItems="center">
                                            <EventIcon style={{marginRight: '.5rem'}}/>
                                            {data.event.date}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" display="flex" justifyContent="center" alignItems="center">
                                            <ScheduleIcon style={{marginRight: '.5rem'}}/>
                                            {data.event.from} - {data.event.to}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Grid container rowSpacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" display="flex" justifyContent="center">
                                            Event Creator
                                        </Typography>
                                        <Divider/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" display="flex" justifyContent="center" alignItems="center">
                                            <BadgeIcon style={{marginRight: '.5rem'}}/>
                                            {data.event.user.username}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" display="flex" justifyContent="center" alignItems="center">
                                            <ContactMailIcon style={{marginRight: '.5rem'}}/>
                                            {data.event.user.email}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" display="flex" justifyContent="center">Participants</Typography>
                            <Divider style={{marginBottom: '1rem'}}/>
                            <Grid container spacing={2}>
                                {
                                    data.event.participants.map((p, index) => {
                                        console.log(p);
                                        return(
                                            <Grid key={index} item xs={12} sm={6}>
                                                <Card variant="outlined" >
                                                    <CardContent>
                                                        <Typography variant="body2" display="flex" justifyContent="center" alignItems="center">
                                                            <BadgeIcon style={{marginRight: '.5rem'}}/>
                                                            {p.user.username}
                                                        </Typography>
                                                        <Typography variant="body2" display="flex" justifyContent="center" alignItems="center">
                                                            <ContactMailIcon style={{marginRight: '.5rem'}}/>
                                                            {p.user.email}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })
                                }
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
};

EventDetail.Title = "Event Detail";

export default EventDetail;