import { UseMyAnswers } from "../../hooks/answer/UseMyAnswer.jsx";
import { useParams , Navigate} from "react-router-dom";
export default function PublicVotationView() {
  const { id } = useParams();
  const { data, loading } = UseMyAnswers(id);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const hasAnswered = data?.summary?.answeredQuestions > 0;

  if (hasAnswered) {
  return <Navigate to={`/public/votation/${id}/update-answer`} replace/>
  } 

  return <Navigate to={`/public/votation/${id}/answer`} replace />;
}