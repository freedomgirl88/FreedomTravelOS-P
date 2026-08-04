import { useState } from "react";
import { Bug, CheckCircle2, Lightbulb, RefreshCw, Share2 } from "lucide-react";
import Page from "../components/Page";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { APP_VERSION, RELEASES } from "../data/releaseNotes";

export default function ReleaseNotes({ updater }) {
  const [feedbackType,setFeedbackType]=useState("Bug report");
  const [feedback,setFeedback]=useState("");
  async function shareFeedback(){
    if(!feedback.trim()){window.ftosToast?.("Add a short description first","warning");return;}
    const text=`Freedom Travel OS P — ${feedbackType}\nVersion: ${APP_VERSION}\nDevice: ${navigator.userAgent}\n\n${feedback.trim()}`;
    if(navigator.share){try{await navigator.share({title:`FTOS P ${feedbackType}`,text});return;}catch{}}
    await navigator.clipboard?.writeText?.(text);
    window.ftosToast?.("Feedback details copied");
  }
  return <Page><header className="app-header"><div><span className="eyebrow">App Updates</span><h1>Release Notes</h1></div><span className="status-chip">v{APP_VERSION}</span></header>
    <Card className="update-centre-card"><div><strong>Your app is ready</strong><p>FTOS P checks for new releases automatically when it is online.</p></div><button onClick={updater.checkForUpdate}><RefreshCw size={17}/> {updater.checking?"Checking…":"Check Now"}</button></Card>
    <SectionTitle title="What's New" subtitle="A permanent history of important improvements."/>
    <div className="release-list">{RELEASES.map(release=><Card className="release-card" key={release.version}><div className="release-card-head"><div><span className="eyebrow">Version {release.version}</span><h2>{release.title}</h2></div><small>{release.date}</small></div>{release.highlights.map(item=><p className="release-point" key={item}><CheckCircle2 size={16}/><span>{item}</span></p>)}</Card>)}</div>
    <SectionTitle title="Help & Feedback" subtitle="Create a ready-to-send report without exposing your trip information."/>
    <Card className="feedback-card"><div className="feedback-type"><button className={feedbackType==="Bug report"?"active":""} onClick={()=>setFeedbackType("Bug report")}><Bug size={16}/> Bug</button><button className={feedbackType==="Feature suggestion"?"active":""} onClick={()=>setFeedbackType("Feature suggestion")}><Lightbulb size={16}/> Idea</button></div><textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder={feedbackType==="Bug report"?"What happened, and what did you expect?":"What would make your trip planning easier?"}/><button className="primary-action full-width-action" onClick={shareFeedback}><Share2 size={17}/> Share Feedback</button></Card>
  </Page>;
}
