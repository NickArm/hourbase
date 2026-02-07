import { useState, useEffect } from 'react';

/**
 * Custom hook for managing tag suggestions with search and project filtering
 *
 * @param {string} projectId - The current project ID
 * @param {Array} allTags - All available tags
 * @returns {Object} Tag suggestion state and handlers
 */
export function useTagSuggestions(projectId, allTags = []) {
    const [suggestions, setSuggestions] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Fetch tag suggestions when project changes or when typing
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (tagSearch === '' && !projectId) {
                setSuggestions(allTags);
                return;
            }

            try {
                const params = new URLSearchParams();
                if (projectId) params.append('project_id', projectId);
                if (tagSearch) params.append('search', tagSearch);

                const response = await fetch(route('tags.suggestions') + '?' + params);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Failed to fetch tag suggestions:', error);
                setSuggestions(allTags);
            }
        };

        const timer = setTimeout(fetchSuggestions, 200);
        return () => clearTimeout(timer);
    }, [tagSearch, projectId, allTags]);

    return {
        suggestions,
        tagSearch,
        setTagSearch,
        showSuggestions,
        setShowSuggestions,
    };
}
