import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, List, ListItem } from "@mui/material";

function StatsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortened")) || [];
    setUrls(stored);
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        URL Statistics
      </Typography>

      {urls.length === 0 ? (
        <Typography>No shortened URLs yet.</Typography>
      ) : (
        urls.map((u, i) => (
          <Card sx={{ mt: 2, boxShadow: 3 }} key={i}>
            <CardContent>
              <Typography>Short URL: <a href={u.shortUrl}>{u.shortUrl}</a></Typography>
              <Typography>Created: {u.createdAt || "N/A"}</Typography>
              <Typography>Expiry: {u.expiry}</Typography>
              <Typography>Total Clicks: {u.clicks}</Typography>
              {u.clickData && u.clickData.length > 0 && (
                <List>
                  {u.clickData.map((c, idx) => (
                    <ListItem key={idx}>
                      {c.timestamp} | {c.source} | {c.location}
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default StatsPage;
