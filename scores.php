<?php
// GET SCORE FROM DB
header("Content-Type: application/json; charset=UTF-8");

$pdo = new PDO("mysql:dbname=scoreboard;host=localhost", "root", "butterfly");
$sql = "SELECT bestscore FROM scores ORDER BY bestscore DESC LIMIT 1";
$db = $pdo->prepare($sql);
$db->execute(array());
$val = $db->fetchAll();
$bestscore = $val[0][0];
echo json_encode($val);

//SEND SCORE TO DB
if(isset($_GET['score']))
{
    if($_GET['score'] > $bestscore)
    {
        $sql = "UPDATE scores SET bestscore=".$_GET['score']." WHERE id = 0"; 
        $score = $pdo->prepare($sql);
        $score->execute(array());
    }
}

?>