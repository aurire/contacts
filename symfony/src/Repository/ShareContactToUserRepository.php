<?php

namespace App\Repository;

use App\Entity\ShareContactToUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ShareContactToUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method ShareContactToUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method ShareContactToUser[]    findAll()
 * @method ShareContactToUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShareContactToUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShareContactToUser::class);
    }

    // /**
    //  * @return ShareContactToUser[] Returns an array of ShareContactToUser objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ShareContactToUser
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
