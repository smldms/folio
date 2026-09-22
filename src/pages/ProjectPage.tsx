import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Project } from '../types/project';
import { getProjectBySlug } from '../lib/api';
import LegacyProjectPage from './LegacyProjectPage';
import EditorialProject from '../components/EditorialProject';
import { safeExternalUrl } from '../components/InteractiveArtwork';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = React.useState<{ slug?: string; project: Project | null; error: boolean; loading: boolean }>({ project: null, error: false, loading: true });
  React.useEffect(() => {
    let cancelled = false;
    setState({ slug, project: null, error: false, loading: true });
    if (!slug) { setState({ slug, project: null, error: false, loading: false }); return; }
    getProjectBySlug(slug).then(project => { if (!cancelled) setState({ slug, project, error: false, loading: false }); })
      .catch(() => { if (!cancelled) setState({ slug, project: null, error: true, loading: false }); });
    return () => { cancelled = true; };
  }, [slug]);
  const current = state.slug === slug && !state.loading;
  const art = current ? state.project?.artworkPresentation : null;
  const editorial = Boolean(art?.displayMode === 'interactive' && safeExternalUrl(art.artworkUrl));
  React.useEffect(() => {
    if (!editorial) return;
    document.body.classList.add('artwork-editorial-active');
    const previous = document.title;
    document.title = `${state.project?.title} — SMLDMS`;
    return () => { document.body.classList.remove('artwork-editorial-active'); document.title = previous; };
  }, [editorial, state.project?.title]);
  if (!current) return <div className="relative z-10 min-h-screen flex items-center justify-center" role="status">Loading project…</div>;
  if (state.error || !state.project) return <div className="relative z-10 min-h-screen flex flex-col items-center justify-center"><p>{state.error ? 'Unable to load this project.' : 'Project not found.'}</p><Link to="/projects">Back to works</Link></div>;
  return editorial ? <EditorialProject project={state.project} /> : <LegacyProjectPage project={state.project} />;
}
