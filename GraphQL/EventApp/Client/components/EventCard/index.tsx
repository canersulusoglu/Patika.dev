import styles from './EventCard.module.css'
import {
    Card,
    CardContent,
    Typography
} from '@mui/material';
import Router from 'next/router';

interface EventCardProps{
    id: Number,
    title: string,
    desc: string,
    date: string
}

export const EventCard = ({id, title, desc, date }: EventCardProps) => {
    return(
        <Card className={styles.container} variant="outlined" onClick={() => Router.push(`/${id}`)}>
            <CardContent>
                <div className={styles.cardHeader}>
                    <Typography sx={{ fontSize: 18, fontWeight: 600 }} gutterBottom>
                        { title }
                    </Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 400, minWidth: '100px' }} gutterBottom>
                        { date }
                    </Typography>
                </div>
                <Typography variant="body1">
                    { desc }
                </Typography>
            </CardContent>
        </Card>
    );
}