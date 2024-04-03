
const Agent = require('../models/agent');
const supabase = require('../config/database');


const agentInfosController = {
    getAgentInfo: async (req, res) => {
        try {
            // Decode the token to extract the agent's username
            const decodedToken = req.decoded; 
            const agentUsername = decodedToken.username;

            // agent information based on the username
            const agentInfo = await Agent.findByUsername(agentUsername);

            //  commune and wilaya details for the agent
            const commune = await supabase.from('communes').select('*').eq('commune_name', agentUsername).single();
            
            const  wilaya = await supabase.from('wilayas').select('*').eq('wilaya_code', commune.data.wilaya_code).single();
            

            // Fetch latest HajInfo for the agent
            const { data: latestHajInfos, error: hajInfoError } = await supabase
            .from('hadj_info')
            .select('*')
            .order('id', { ascending: false }) 
            .limit(1);
            if (hajInfoError) {
                throw hajInfoError;
            }
        

            // Construct response object with agent information
            const agentResponse = {
                id: agentInfo.id,
                username: agentInfo.username,
                commune: commune,
                wilaya: wilaya,
                latestHajInfo: latestHajInfos
            };

            res.json(agentResponse);
        } catch (error) {
            console.error('Error fetching agent information:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getCandidatesByCommune: async (req, res) => {
        try {
            // Extract commune residence (username) of the logged-in agent
            const agentUsername = req.decoded.username;
    
            const { data: candidates, error } = await supabase
                .from('candidats_duplicate')
                .select('firstName_ar', 'lastName_ar')
                .eq('commune_résidence', agentUsername);
    
            if (error) {
                throw error;
            }
    
            // Check if there are no candidates
            if (!candidates || candidates.length === 0) {
                return res.status(404).json({ message: 'No candidates found for the logged-in agent' });
            }
    
            // Extract candidate names from the query result
            const candidateNames = candidates.map(candidate => `${candidate.firstName_ar} ${candidate.lastName_ar}`);
    
            res.json({ candidates: candidateNames });
        } catch (error) {
            console.error('Error fetching candidates by commune:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
};

module.exports = agentInfosController;
