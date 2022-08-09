import styles from "styles/layouts/MainLayout.module.css";
import Head from 'next/head'
import Image from 'next/image'
import {
    Slide,
    AppBar,
    Toolbar,
    Container,
    Typography,
    useScrollTrigger
} from "@mui/material";

function HideOnScroll(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
}

interface MainLayoutProps{
    pageTitle: string,
    children: JSX.Element
}

const MainLayout = ({ pageTitle, children }: MainLayoutProps) => {
    return(
        <div className={styles.container}>
            <Head>
                <title>Event App</title>
                <meta name="description" content="Event management application." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <HideOnScroll>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6" component="div">
                            {pageTitle}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Toolbar />
                <Container>
                    { children }
                </Container>
            </main>

            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}

export default MainLayout;