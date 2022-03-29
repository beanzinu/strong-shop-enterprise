function countNcpItems( item ){
    let count = 0 ;
    let flag = false; 
    let firstItem = "";
    
    if ( item.hasOwnProperty("tinting")) { if ( !flag ) { flag = true; firstItem = "틴팅" } count += 1 } ;
    if ( item.hasOwnProperty("ppf")) { if ( !flag ) { flag = true;  firstItem = "PPF" } count += 1 } ;
    if ( item.hasOwnProperty("blackbox")) { if ( !flag ) { flag = true; firstItem = "블랙박스" } count += 1 } ;
    if ( item.hasOwnProperty("battery")) { if ( !flag ) { flag = true; firstItem = "보조배터리" } count += 1 } ;
    if ( item.hasOwnProperty("afterblow")) { if ( !flag ) { flag = true; firstItem = "애프터블로우" } count += 1 } ;
    if ( item.hasOwnProperty("soundproof")) { if ( !flag ) { flag = true; firstItem = "방음" } count += 1 } ;
    if ( item.hasOwnProperty("wrapping")) { if ( !flag ) { flag = true; firstItem = "랩핑" } count += 1 } ;
    if ( item.hasOwnProperty("glasscoating")) { if ( !flag ) { flag = true; firstItem = "유리막코팅" } count += 1 } ;
    if ( item.hasOwnProperty("bottomcoating")) { if ( !flag ) { flag = true; firstItem = "하부코팅" } count += 1 } ;
    return firstItem + " 등 " + count + "건";
};

function countCareItems( item ){
    let count = 0 ;
    let flag = false; 
    let firstItem = "";
    
    if ( item.carwash ) { if ( !flag ) { flag = true; firstItem = "세차" } count += 1 } ;
    if ( item.inside ) { if ( !flag ) { flag = true; firstItem = "내부" } count += 1 } ;
    if ( item.outside ) { if ( !flag ) { flag = true; firstItem = "외부" } count += 1 } ;
    if ( item.scratch ) { if ( !flag ) { flag = true; firstItem = "스크레치" } count += 1 } ;
    if ( item.etc ) { if ( !flag ) { flag = true; firstItem = "기타" } count += 1 } ;
    
    return firstItem + " 등 " + count + "건";
}

export default { countNcpItems , countCareItems } ;