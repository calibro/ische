import React, { useEffect, useState } from "react";
import './ResourceView.sass';
import Airtable from 'airtable'
import {Spinner} from 'react-bootstrap'
import * as embedUtils from '../utils/embed'
import ResourcesSlider from '../components/ResourcesSlider'
import ResourceExtendedInfo from '../components/ResourceExtendedInfo'

const RelatedResources = ({resource}) => {
  const [relatedResources, setRelatedResources] = useState([]);
  
  useEffect(() => {
    var base = new Airtable({
      apiKey:process.env.REACT_APP_AIRTABLE_API_KEY
    }).base('appyRkLfkVtG84rMU');

    base('Data Sample').select({
      view: 'Grid view',
      filterByFormula: 'FIND("'+resource.fields['Type_name']+'",{Type})'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        setRelatedResources(records)
    })
  }, [])

  return relatedResources.length > 0 ? <ResourcesSlider items={relatedResources}></ResourcesSlider> : <div>No related resources</div>

}


const ResourceView = ({resourceId}) => {
  const [resource, setResource] = useState({});
  let viewRef = React.createRef()

  useEffect(() => {
    viewRef.current && viewRef.current.scrollTo(0, 0)
    setResource({})
    var base = new Airtable({
      apiKey:process.env.REACT_APP_AIRTABLE_API_KEY
    }).base('appyRkLfkVtG84rMU');
    
    base('Data Sample').find(resourceId, function(err, record) {
      if (err) { console.error(err); return; }
      setResource(record)
    })
  }, [resourceId])

  const generateEmbedCode = () => {
    let code = <div></div>
    let source
    try {
      source = new URL(resource.fields['URL'])
    } catch (err) {
      code = <div>No url is defined</div>
    }
    if (source){
      // YouTube
      if (source.hostname.includes('youtu')) {
        let youtubeId = embedUtils.getYoutubeId(source.href)
        code = <iframe width="100%" height="360"  title="content" src={'https://www.youtube.com/embed/' + youtubeId} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      }

      // VIMEO
      else if (source.hostname.includes('vimeo')) {
        let vimeoId = embedUtils.getVimeoId(source.href)
        code = <iframe width="100%" height="360" title="content" src={"https://player.vimeo.com/video/" + vimeoId} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
      }

      // Archive
      else if (source.hostname.includes('archive.org')) {
        let archiveUrl = embedUtils.getArchiveURL(source.href)
        code = <iframe width="100%" height="360" title="content" src={archiveUrl} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
      }

      // Spotify
      else if (source.hostname.includes('spotify')) {
        let spotifyUrl = embedUtils.getSpotifyUrl(source.href)
        code = <iframe width="100%" height="360" title="content" src={spotifyUrl} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      }
      // Soundcloud
      else if (source.hostname.includes('soundcloud')) {
        code = <iframe width="100%" height="300" title="content" scrolling="no" frameBorder="no" allow="autoplay" src={'https://w.soundcloud.com/player/?url=' + encodeURIComponent(source.href) + '&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'}></iframe>
      }
    }

    return code
  }

  const ResourceMedia = () => {
    let resourceContent = <span>No item format defined</span>
    let format = resource.fields['item_format']
    if (format === 'Website') {
      resourceContent = <img src={resource.fields['Attachments'][0].url} alt={resource.fields['Title ID']}></img>
    } 
    else if (format === 'Image') {
      // Here maybe a gallery?
      resourceContent = <img src={resource.fields['Attachments'][0].url} alt={resource.fields['Title ID']}></img>
    }
    else if (format === 'Embed') {
      // Here maybe a gallery?
      resourceContent = generateEmbedCode()
    }
    return resourceContent
  }
  

  return resource.fields ? 
    (
    <div className="resource-page" ref={viewRef}>
      <div className="resource-view">
        <div className="resource-preview">
          <ResourceMedia></ResourceMedia>
        </div>
        <div className="resource-sideinfo-container">
          <ResourceExtendedInfo resource={resource}></ResourceExtendedInfo>
        </div>
      </div>
      <div className="related-resources">
        <div className="related-options">
          Explore other <b>{resource.fields['Type_name']}</b>
        </div>
        <RelatedResources resource={resource}></RelatedResources>
      </div>
    </div>
    )
  :
  (<div className="loading"><Spinner animation="border" />Loading resource</div>)
}

export default ResourceView