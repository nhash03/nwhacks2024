
export const BG = ({image}) => {
    if (image == 'medication'){
        return <div className="bg medication"/>
    } else {
    return <div className={`bg search`}/>
    }
};